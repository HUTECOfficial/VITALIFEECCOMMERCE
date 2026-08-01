const { createClient } = require("@supabase/supabase-js");
const sharp = require("sharp");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const argument = (name, fallback) => {
  const value = process.argv.find((item) => item.startsWith(`--${name}=`));
  return value ? Number(value.slice(name.length + 3)) : fallback;
};

const limit = Math.min(Math.max(argument("limit", 60), 1), 70);
const offset = Math.max(argument("offset", 0), 0);
const minimumDimension = 800;
const ignoredTerms = new Set([
  "c", "p", "de", "del", "la", "el", "los", "las", "con", "sin", "para", "por", "una", "uno",
  "sol", "solucion", "iny", "esteril", "esteriles", "est", "eq", "pza", "pzas", "amp", "ampolleta",
  "caja", "bolsa", "fco", "tab", "tabs", "mg", "ml", "cm", "mm", "fr", "g",
]);

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function termsFor(name) {
  const canonical = normalize(name)
    .replace(/(\d)([a-z])/g, "$1 $2")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/(\d)x(\d)/g, "$1 x $2");
  const terms = canonical.match(/[a-z0-9]+/g) ?? [];
  return [...new Set(terms.filter((term) => !ignoredTerms.has(term) && (term.length >= 3 || /^\d+$/.test(term))))]
    .slice(0, 8);
}

async function fetchWithTimeout(url, options = {}, timeout = 12000) {
  const signal = AbortSignal.timeout(timeout);
  const response = await fetch(url, {
    ...options,
    signal,
    headers: {
      "user-agent": "Vital Life catalog source verifier/1.0",
      ...(options.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}

function searchResultUrls(html) {
  const urls = [];
  for (const match of html.matchAll(/result__a" href="([^"]+)/g)) {
    const href = match[1].replace(/&amp;/g, "&");
    try {
      const url = new URL(href, "https://duckduckgo.com");
      const destination = url.searchParams.get("uddg");
      if (destination?.startsWith("http") && !urls.includes(destination)) urls.push(destination);
    } catch {
      // Skip malformed search-result links.
    }
  }
  return urls.slice(0, 6);
}

function findOpenGraphImage(html) {
  const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    ?? html.match(/data-thumb=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

function fullImageUrl(value, sourcePage) {
  const url = new URL(value.replace(/&amp;|&#038;/g, "&"), sourcePage);
  for (const key of ["width", "height", "crop", "resize", "fit"]) url.searchParams.delete(key);
  return url.toString();
}

async function discoverProduct(product) {
  const expectedTerms = termsFor(product.name);
  if (expectedTerms.length < 2) return null;

  const query = encodeURIComponent(`"${product.name}"`);
  let searchHtml;
  try {
    searchHtml = await (await fetchWithTimeout(`https://html.duckduckgo.com/html/?q=${query}`)).text();
  } catch {
    return null;
  }

  for (const sourcePage of searchResultUrls(searchHtml)) {
    try {
      const pageHtml = await (await fetchWithTimeout(sourcePage)).text();
      const pageText = normalize(pageHtml);
      const confirmedTerms = expectedTerms.filter((term) => pageText.includes(term));
      if (confirmedTerms.length !== expectedTerms.length) continue;

      const ogImage = findOpenGraphImage(pageHtml);
      if (!ogImage) continue;
      const sourceImage = fullImageUrl(ogImage, sourcePage);
      const buffer = Buffer.from(await (await fetchWithTimeout(sourceImage)).arrayBuffer());
      const metadata = await sharp(buffer).metadata();
      const width = metadata.autoOrient?.width ?? metadata.width ?? 0;
      const height = metadata.autoOrient?.height ?? metadata.height ?? 0;
      if (Math.max(width, height) < minimumDimension) continue;

      return { slug: product.slug, sourcePage, expectedTerms, width, height };
    } catch {
      // Try the next source result; failed candidates are intentionally omitted.
    }
  }
  return null;
}

async function mapWithConcurrency(items, worker, concurrency = 5) {
  const results = new Array(items.length);
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const current = index++;
      if (current >= items.length) return;
      results[current] = await worker(items[current]);
    }
  }));
  return results;
}

async function main() {
  const { data, error } = await supabase
    .from("products")
    .select("slug,name,image")
    .order("slug")
    .range(0, 1999);
  if (error) throw error;

  const pending = data
    .filter((product) => !String(product.image ?? "").includes("/VITALIFE/catalog/"))
    .slice(offset, offset + limit);
  const discoveries = (await mapWithConcurrency(pending, discoverProduct)).filter(Boolean);

  console.log(JSON.stringify({
    requested: pending.length,
    validated: discoveries.length,
    discoveries,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
