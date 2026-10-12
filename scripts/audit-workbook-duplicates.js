const { createClient } = require("@supabase/supabase-js");
const workbookCatalog = require("../data/workbook-catalog.json");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const stopWords = new Set([
  "a", "al", "con", "de", "del", "el", "en", "la", "las", "los", "para", "por", "sin", "y",
  "c", "caja", "frasco", "galon", "paquete", "pieza", "piezas", "ml", "mm", "cm", "l",
  "esteril", "esteriles", "no", "p", "x", "marca",
]);

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\bsol\b/g, "solucion")
    .replace(/\bhta?\b/g, "hartmann")
    .replace(/\bdx\b/g, "glucosa")
    .replace(/\bcs\b/g, "cloruro sodio")
    .replace(/\bjga\b/g, "jeringa")
    .replace(/\b(?:pzs?|pcs?)\b/g, "piezas")
    .replace(/[^a-z0-9.%]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value) {
  return new Set(normalize(value).split(" ").filter((token) => token && !stopWords.has(token)));
}

function score(row, product) {
  const desired = tokens(`${row.name} ${row.brand}`);
  const actual = tokens(`${product.name} ${product.brand || ""}`);
  let overlap = 0;
  for (const token of desired) if (actual.has(token)) overlap += token.length > 4 ? 2 : 1;
  const brand = normalize(row.brand);
  const brandHit = normalize(`${product.name} ${product.brand || ""}`).split(" ").includes(brand);
  const union = new Set([...desired, ...actual]).size || 1;
  return overlap / union + (brandHit ? 1 : 0);
}

async function main() {
  let query = supabase
    .from("products")
    .select("id,name,slug,brand,presentation,sizes,stock_quantity,image,created_at,product_variants(color,size,stock_quantity,image)")
    .order("created_at", { ascending: true });
  if (!process.argv.includes("--all")) query = query.not("slug", "like", "catalogo-%");
  const { data, error } = await query;
  if (error) throw error;

  const searchIndex = process.argv.indexOf("--search");
  if (searchIndex >= 0) {
    const terms = normalize(process.argv[searchIndex + 1]).split(" ").filter(Boolean);
    for (const product of data.filter((candidate) => {
      const value = normalize(`${candidate.name} ${candidate.slug} ${candidate.brand || ""}`);
      return terms.every((term) => value.includes(term));
    })) {
      console.log(JSON.stringify(product));
    }
    return;
  }

  for (const [index, row] of workbookCatalog.entries()) {
    const matches = data
      .map((product) => ({ product, score: score(row, product) }))
      .filter((candidate) => candidate.score >= 0.4)
      .sort((left, right) => right.score - left.score)
      .slice(0, 8);
    console.log(`\n${String(index + 1).padStart(2, "0")} | ${row.brand} | ${row.name} | ${(row.options || []).join(", ")}`);
    for (const { product, score: candidateScore } of matches) {
      console.log(`  ${candidateScore.toFixed(2)} | ${product.slug} | ${product.name} | ${product.brand || ""} | ${product.presentation || ""}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
