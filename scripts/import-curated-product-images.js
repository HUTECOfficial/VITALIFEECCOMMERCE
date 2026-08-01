const fs = require("fs");
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const selectedSlugs = new Set(
  process.argv
    .filter((argument) => argument.startsWith("--slug="))
    .flatMap((argument) => argument.slice("--slug=".length).split(","))
    .filter(Boolean)
);
const sources = JSON.parse(fs.readFileSync("data/product-image-sources.json", "utf8"))
  .filter((source) => source.enabled !== false)
  .filter((source) => selectedSlugs.size === 0 || selectedSlugs.has(source.slug));
const imageOverrides = JSON.parse(fs.readFileSync("data/product-image-overrides.json", "utf8"));
const bucket = "VITALIFE";
// 800px reales cubren nítidamente las tarjetas y el detalle responsivo, sin
// ampliar artificialmente material fuente de baja calidad.
const minimumDimension = 800;
const dryRun = process.argv.includes("--dry-run");

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\bi\s*\.\s*m\s*\.?/gi, " im ")
    .replace(/\bi\s*\.\s*v\s*\.?/gi, " iv ")
    .replace(/×/g, "x")
    .toLowerCase();
}

function includesExpectedTerm(pageText, term) {
  const normalizedTerm = normalize(term);
  if (normalizedTerm === "im" || normalizedTerm === "iv") {
    return new RegExp(`\\b${normalizedTerm}\\b`).test(pageText);
  }
  if (/^\d+(?:\.\d+)?$/.test(normalizedTerm)) {
    return new RegExp(`(?<![\\d.])${normalizedTerm.replace(".", "\\.")}(?![\\d.])`).test(pageText);
  }
  // A presentation such as "1 g", "20 mg" or "5 x 2 ml" must be checked as
  // a whole expression. Comparing only the digits could accept a different
  // concentration or an unrelated package count.
  if (/\d/.test(normalizedTerm)) {
    const compactText = pageText.replace(/\s+/g, "");
    const compactTerm = normalizedTerm.replace(/\s+/g, "");
    return compactText.includes(compactTerm);
  }
  return pageText.includes(normalizedTerm);
}

function findOpenGraphImage(html) {
  const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (match?.[1]) return match[1];

  // Some WordPress stores do not set OG metadata but their product gallery
  // exposes the original image through data-thumb.
  return html.match(/data-thumb=["']([^"']+)["']/i)?.[1] ?? null;
}

function farmalistoProductMetadata(html) {
  const fields = [];
  const add = (value) => {
    if (typeof value === "string") fields.push(value.replace(/<[^>]*>/g, " "));
  };
  add(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  add(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]);
  add(html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1]);
  add(html.match(/<h1[^>]*class=["'][^"']*product_title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
  return normalize(fields.join(" "));
}

function fahorroProductMetadata(html) {
  const fields = [];
  const add = (value) => {
    if (typeof value === "string") fields.push(value.replace(/<[^>]*>/g, " "));
  };
  add(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  add(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]);
  add(html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]);
  add(html.match(/<h1[^>]*class=["'][^"']*page-title[^"']*["'][^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/h1>/i)?.[1]);
  return normalize(fields.join(" "));
}

function fullImageUrl(value, sourcePage) {
  const url = new URL(value.replace(/&amp;|&#038;/g, "&"), sourcePage);
  // Shopify's OG image adds a 600px crop. Removing its resize parameters keeps
  // the original supplier asset when it is available.
  for (const key of ["width", "height", "crop", "resize", "fit"]) url.searchParams.delete(key);
  return url.toString();
}

async function fetchOk(url) {
  const response = await fetch(url, { headers: { "user-agent": "Vital Life catalog image verifier/1.0" } });
  if (!response.ok) throw new Error(`${response.status} al descargar ${url}`);
  return response;
}

async function importSource(source) {
  const pageResponse = await fetchOk(source.sourcePage);
  const pageHtml = await pageResponse.text();
  const pageText = (source.sourcePage.includes("farmalisto.com.mx") || source.sourcePage.includes("laboratoriosdemexico.com.mx"))
    ? farmalistoProductMetadata(pageHtml)
    : source.sourcePage.includes("fahorro.com")
      ? fahorroProductMetadata(pageHtml)
      : normalize(pageHtml);
  const missingTerms = source.expectedTerms.filter((term) => !includesExpectedTerm(pageText, term));
  if (missingTerms.length) throw new Error(`La ficha fuente no confirma: ${missingTerms.join(", ")}`);

  const ogImage = source.sourceImage ?? findOpenGraphImage(pageHtml);
  if (!ogImage) throw new Error("La ficha fuente no expone og:image");

  const sourceImage = fullImageUrl(ogImage, source.sourcePage);
  const imageResponse = await fetchOk(sourceImage);
  const input = Buffer.from(await imageResponse.arrayBuffer());
  const metadata = await sharp(input).metadata();
  const width = metadata.autoOrient?.width ?? metadata.width ?? 0;
  const height = metadata.autoOrient?.height ?? metadata.height ?? 0;
  // An explicit source exception is allowed only for a verified, exact product
  // image when no clean high-resolution asset is published. It never enlarges
  // the source asset.
  const requiredMinimumDimension = source.minimumDimension ?? minimumDimension;
  if (Math.max(width, height) < requiredMinimumDimension) {
    throw new Error(`Resolución insuficiente: ${width}×${height}`);
  }

  if (dryRun) {
    console.log(`✓ ${source.slug}: ${width}×${height} — ${source.sourcePage}`);
    return;
  }

  const output = await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 94, smartSubsample: true })
    .toBuffer();
  const filename = `catalog/${source.slug}.webp`;
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filename, output, { contentType: "image/webp", upsert: true, cacheControl: "31536000" });
  if (uploadError) throw uploadError;

  const image = imageOverrides[source.slug];
  if (!image) throw new Error("Falta la URL pública de destino en product-image-overrides.json");
  const { error: productError } = await supabase.from("products").update({ image }).eq("slug", source.slug);
  if (productError) throw productError;

      if (!dryRun) console.log(`✓ ${source.slug}: ${width}×${height} — ${source.sourcePage}`);
}

async function main() {
  let imported = 0;
  for (const source of sources) {
    try {
      await importSource(source);
      imported += 1;
    } catch (error) {
      console.error(`✗ ${source.slug}: ${error.message}`);
    }
  }
  console.log(`${dryRun ? "Verificadas" : "Importadas"} ${imported}/${sources.length} imágenes.`);
  if (imported !== sources.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
