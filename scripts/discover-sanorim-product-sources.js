const { createClient } = require("@supabase/supabase-js");
const sharp = require("sharp");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const valueFor = (name, fallback) => {
  const argument = process.argv.find((value) => value.startsWith(`--${name}=`));
  return argument ? Number(argument.slice(name.length + 3)) : fallback;
};

const limit = Math.min(Math.max(valueFor("limit", 60), 1), 70);
const offset = Math.max(valueFor("offset", 0), 0);
const minimumDimension = 800;
const storeName = process.argv.find((value) => value.startsWith("--store="))?.slice("--store=".length) ?? "sanorim";
const category = process.argv.find((value) => value.startsWith("--category="))?.slice("--category=".length);
const stores = {
  sanorim: "https://sanorim.mx",
  lapaz: "https://farmacialapaz.com.mx",
  farmas: "https://farmas.mx",
  wecare: "https://wecarepharma.mx",
  ambiderm: "https://shop.ambiderm.com.mx",
  hergom: "https://hergom-medical.com",
  farmalisto: "https://farmalisto.com.mx",
  labmex: "https://laboratoriosdemexico.com.mx",
  fahorro: "https://www.fahorro.com",
};
const storeUrl = stores[storeName];
if (!storeUrl) throw new Error(`Tienda no soportada: ${storeName}`);
const ignoredTerms = new Set([
  "c", "p", "de", "del", "la", "el", "los", "las", "con", "sin", "para", "por", "una", "uno",
  "sol", "solucion", "iny", "esteril", "esteriles", "est", "eq", "pza", "pzas", "amp", "ampolleta",
  "caja", "bolsa", "fco", "tab", "tabs", "tabletas", "mg", "ml", "cm", "mm", "fr", "g",
]);

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\bi\s*\.\s*m\s*\.?/gi, " im ")
    .replace(/\bi\s*\.\s*v\s*\.?/gi, " iv ")
    .replace(/×/g, "x")
    .toLowerCase();
}

function productTerms(name) {
  const normalizedName = normalize(name);
  const terms = normalizedName.match(/\d+(?:\.\d+)?(?:x\d+(?:\.\d+)?)?(?:[a-z]+)?|[a-z]{3,}/g) ?? [];
  const presentationTerms = [];
  if (/\bim\b/.test(normalizedName)) presentationTerms.push("im");
  if (/\biv\b/.test(normalizedName)) presentationTerms.push("iv");
  if (/\b(?:tab|tabs|tabletas?)\b/.test(normalizedName)) presentationTerms.push("tabletas");
  if (/\b(?:cap|caps|capsulas?)\b/.test(normalizedName)) presentationTerms.push("capsulas");
  if (/\b(?:amp|ampolletas?)\b/.test(normalizedName)) presentationTerms.push("ampolletas");
  if (/\biny(?:ectable)?\b/.test(normalizedName)) presentationTerms.push("inyectable");
  return [...new Set([...terms.filter((term) => !ignoredTerms.has(term)), ...presentationTerms])];
}

function includesTerm(text, term) {
  const normalizedText = normalize(text);
  if (term === "im" || term === "iv") {
    return new RegExp(`\\b${term}\\b`).test(normalizedText);
  }
  if (/^\d+(?:\.\d+)?$/.test(term)) {
    return new RegExp(`(?<![\\d.])${term.replace(".", "\\.")}(?![\\d.])`).test(normalizedText);
  }
  if (/\d/.test(term)) {
    return normalizedText.replace(/\s+/g, "").includes(term.replace(/\s+/g, ""));
  }
  return normalizedText.includes(term);
}

async function fetchOk(url, timeout = 15000) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeout),
    headers: { "user-agent": "Vital Life catalog source verifier/1.0" },
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}

function sourcePageUrl(url) {
  const page = new URL(url, storeUrl);
  page.search = "";
  return page.toString();
}

async function candidateFor(product) {
  if (storeName === "farmalisto" || storeName === "labmex") return candidateForPrestaShop(product);
  if (storeName === "fahorro") return candidateForFahorro(product);

  const terms = productTerms(product.name);
  const textTerms = terms.filter((term) => /[a-z]/.test(term));
  if (textTerms.length < 1) return null;

  const query = encodeURIComponent(textTerms.slice(0, 3).join(" "));
  const searchUrl = `${storeUrl}/search/suggest.json?q=${query}&resources%5Btype%5D=product`;
  let products;
  try {
    const payload = await (await fetchOk(searchUrl)).json();
    products = payload?.resources?.results?.products ?? [];
  } catch {
    return null;
  }

  for (const result of products.slice(0, 5)) {
    const titleMatches = terms.filter((term) => includesTerm(result.title, term));
    const textMatches = textTerms.filter((term) => includesTerm(result.title, term));
    const presentationTerms = terms.filter((term) => /\d/.test(term));
    const presentationMatches = presentationTerms.filter((term) => includesTerm(result.title, term));
    if (textMatches.length < Math.min(2, textTerms.length)) continue;
    if (presentationMatches.length !== presentationTerms.length) continue;
    if (titleMatches.length !== terms.length) continue;

    const sourcePage = sourcePageUrl(result.url);
    const sourceImage = result.featured_image?.url;
    if (!sourceImage) continue;

    try {
      const image = Buffer.from(await (await fetchOk(sourceImage)).arrayBuffer());
      const metadata = await sharp(image).metadata();
      const width = metadata.autoOrient?.width ?? metadata.width ?? 0;
      const height = metadata.autoOrient?.height ?? metadata.height ?? 0;
      if (Math.max(width, height) < minimumDimension) continue;

      return {
        slug: product.slug,
        sourcePage,
        sourceImage,
        expectedTerms: [...new Set([...textMatches, ...presentationMatches])],
        width,
        height,
      };
    } catch {
      // Test the next exact-looking product match.
    }
  }
  return null;
}

function productMetadataFromFahorro(html) {
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

async function candidateForFahorro(product) {
  const terms = productTerms(product.name);
  const textTerms = terms.filter((term) => /[a-z]/.test(term));
  if (textTerms.length < 1) return null;

  // The retailer can omit a lab name or dosage from its search index. Search
  // by the main medicine/brand terms and retain only candidates whose product
  // title and own page still satisfy every required term below.
  const query = encodeURIComponent(textTerms.slice(0, 2).join(" "));
  const searchUrl = `https://api.empathy.co/search/v1/query/fda/search?query=${query}&start=0&rows=50&lang=es`;
  let candidates;
  try {
    const payload = await (await fetchOk(searchUrl)).json();
    candidates = payload?.catalog?.content ?? [];
  } catch {
    return null;
  }

  for (const result of candidates) {
    const title = result.ecommTitle ?? "";
    if (!terms.every((term) => includesTerm(title, term))) continue;
    if (!result.ecommUrlKey || !result.ecommImageFullUrl) continue;

    const sourcePage = `${storeUrl}/${result.ecommUrlKey}.html`;
    try {
      const pageHtml = await (await fetchOk(sourcePage)).text();
      const pageText = productMetadataFromFahorro(pageHtml);
      if (!terms.every((term) => includesTerm(pageText, term))) continue;

      const sourceImage = result.ecommImageFullUrl;
      const image = Buffer.from(await (await fetchOk(sourceImage)).arrayBuffer());
      const metadata = await sharp(image).metadata();
      const width = metadata.autoOrient?.width ?? metadata.width ?? 0;
      const height = metadata.autoOrient?.height ?? metadata.height ?? 0;
      if (Math.max(width, height) < minimumDimension) continue;

      return {
        slug: product.slug,
        sourcePage,
        sourceImage,
        expectedTerms: terms,
        width,
        height,
      };
    } catch {
      // Product pages can be retired even when the search index still has them.
    }
  }
  return null;
}

function productLinksFromJsonLd(html) {
  const links = [];
  const storeHost = new URL(storeUrl).hostname;
  const scripts = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

  function visit(value) {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== "object") return;
    if (typeof value.name === "string" && typeof value.url === "string") {
      try {
        const url = new URL(value.url);
        if (url.hostname === storeHost && /\.html(?:$|\?)/.test(url.pathname)) {
          links.push({ title: value.name, url: value.url });
        }
      } catch {
        // Skip malformed structured-data links.
      }
    }
    Object.values(value).forEach(visit);
  }

  for (const script of scripts) {
    try {
      visit(JSON.parse(script[1].trim()));
    } catch {
      // A malformed unrelated JSON-LD block does not invalidate the search page.
    }
  }

  // PrestaShop 1.6 stores such as Laboratorios de México render conventional
  // product cards instead of ItemList JSON-LD.
  for (const match of html.matchAll(/<a[^>]+class=["'][^"']*product-name[^"']*["'][^>]+href=["']([^"']+)["'][^>]+title=["']([^"']+)["']/gi)) {
    try {
      const url = new URL(match[1].replace(/&amp;/g, "&"), storeUrl);
      if (url.hostname === storeHost && /\.html$/.test(url.pathname)) {
        links.push({ title: match[2].replace(/&amp;/g, "&"), url: url.toString() });
      }
    } catch {
      // Ignore malformed card links.
    }
  }

  return [...new Map(links.map((link) => [link.url, link])).values()];
}

function imageFromFarmalistoProductPage(html) {
  const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    ?? html.match(/(?:data-image|data-zoom-image|data-full-size-image-url)=["']([^"']+)["']/i)
    ?? html.match(/href=["']([^"']+-large_default\/[^"']+)["']/i);
  const image = match?.[1]?.replace(/&amp;/g, "&") ?? null;
  return image?.replace(/-home_default\//, "-large_default/") ?? null;
}

function productMetadataFromPrestaShop(html) {
  const fields = [];
  const add = (value) => {
    if (typeof value === "string") fields.push(value.replace(/<[^>]*>/g, " "));
  };
  add(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  add(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]);
  add(html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1]);
  add(html.match(/<h1[^>]*class=["'][^"']*product_title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i)?.[1]);

  const scripts = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  function visit(value) {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== "object") return;
    const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
    if (types.includes("Product")) {
      add(value.name);
      add(value.description);
    }
    Object.values(value).forEach(visit);
  }
  for (const script of scripts) {
    try {
      visit(JSON.parse(script[1].trim()));
    } catch {
      // Ignore malformed unrelated structured-data blocks.
    }
  }
  return normalize(fields.join(" "));
}

async function candidateForPrestaShop(product) {
  const terms = productTerms(product.name);
  const textTerms = terms.filter((term) => /[a-z]/.test(term));
  if (textTerms.length < 1) return null;

  // These public PrestaShop catalogs expose product links in JSON-LD search
  // results. We still verify the actual product page below before accepting an
  // asset.
  const query = encodeURIComponent(textTerms.slice(0, 2).join(" "));
  const searchUrl = storeName === "labmex"
    ? `${storeUrl}/search?controller=search&search_query=${query}`
    : `${storeUrl}/buscar?controller=search&s=${query}`;
  let links;
  try {
    links = productLinksFromJsonLd(await (await fetchOk(searchUrl)).text());
  } catch {
    return null;
  }

  for (const result of links.slice(0, 12)) {
    const candidateText = normalize(result.title);
    // Product names in the results often omit the active ingredient or the
    // brand. The page itself below is the authoritative validation point.
    if (!textTerms.some((term) => includesTerm(candidateText, term))) continue;

    try {
      const pageHtml = await (await fetchOk(result.url)).text();
      const pageText = productMetadataFromPrestaShop(pageHtml);
      if (!terms.every((term) => includesTerm(pageText, term))) continue;

      const sourceImage = imageFromFarmalistoProductPage(pageHtml);
      if (!sourceImage) continue;
      const image = Buffer.from(await (await fetchOk(sourceImage)).arrayBuffer());
      const metadata = await sharp(image).metadata();
      const width = metadata.autoOrient?.width ?? metadata.width ?? 0;
      const height = metadata.autoOrient?.height ?? metadata.height ?? 0;
      if (Math.max(width, height) < minimumDimension) continue;

      return {
        slug: product.slug,
        sourcePage: result.url,
        sourceImage,
        expectedTerms: terms,
        width,
        height,
      };
    } catch {
      // Keep looking: a search result can be unavailable or lack a large asset.
    }
  }
  return null;
}

async function mapWithConcurrency(items, worker, concurrency = 4) {
  const results = new Array(items.length);
  let current = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const index = current++;
      if (index >= items.length) return;
      results[index] = await worker(items[index]);
    }
  }));
  return results;
}

async function main() {
  const { data, error } = await supabase
    .from("products")
    .select("slug,name,category,image")
    .order("slug")
    .range(0, 1999);
  if (error) throw error;

  const pending = data
    .filter((product) => !String(product.image ?? "").includes("/VITALIFE/catalog/"))
    .filter((product) => !category || product.category === category)
    .slice(offset, offset + limit);
  const sources = (await mapWithConcurrency(pending, candidateFor)).filter(Boolean);

  console.log(JSON.stringify({ requested: pending.length, validated: sources.length, sources }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
