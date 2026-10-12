const { createClient } = require("@supabase/supabase-js");
const reconciliation = require("../data/catalog-reconciliation.json");
const inventory = require("../productos_extraidos.json");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function inventorySlug(record) {
  return `${slugify(record["Descripción del producto  "])}-${slugify(record["Clave de artículo "])}`;
}

function parseInventoryVariant(name) {
  const normalized = String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  const sizePatterns = [
    [/\b(?:CHICA|CHICO)\b/, "Chico"],
    [/\b(?:MEDIANA|MEDIANO|MED)\b/, "Mediano"],
    [/\bGRANDE\b/, "Grande"],
    [/(?:#|TALLA\s*)6(?:\.0)?\b/, "6"],
    [/(?:#|TALLA\s*)7\.5\b|TALLA\s*7\s+1\/2\b/, "7.5"],
    [/(?:#|TALLA\s*)7(?:\.0)?\b/, "7"],
    [/(?:#|TALLA\s*)8\.5\b|TALLA\s*8\s+1\/2\b/, "8.5"],
    [/(?:#|TALLA\s*)8(?:\.0)?\b/, "8"],
  ];
  const colorPatterns = [
    [/\bAZUL ROYAL\b/, "Azul royal"],
    [/\bAZUL COBALTO\b/, "Azul cobalto"],
    [/\bNEGRO\b|\bNEGRA\b/, "Negro"],
    [/\bBLANCO\b|\bBLANCA\b/, "Blanco"],
    [/\bVIOLETA\b/, "Violeta"],
    [/\bROSA\b/, "Rosa"],
  ];
  return {
    size: sizePatterns.find(([pattern]) => pattern.test(normalized))?.[1] || "",
    color: colorPatterns.find(([pattern]) => pattern.test(normalized))?.[1] || "",
  };
}

function variantKey(color, size) {
  return `${color || ""}\u0000${size || ""}`;
}

function addVariant(variants, value) {
  const color = value.color || "";
  const size = value.size || "";
  const key = variantKey(color, size);
  const current = variants.get(key) || { color, size, stockQuantity: 0, image: null };
  current.stockQuantity += Math.max(0, Number(value.stockQuantity) || 0);
  if (!current.image && value.image) current.image = value.image;
  variants.set(key, current);
}

function productStock(product) {
  const variants = product.product_variants || [];
  if (variants.length) {
    return variants.reduce((total, variant) => total + Math.max(0, Number(variant.stock_quantity) || 0), 0);
  }
  return Math.max(0, Number(product.stock_quantity) || 0);
}

function buildGroupVariants(group, productBySlug, inventoryByCode) {
  const canonical = productBySlug.get(group.canonicalSlug);
  const alreadyReconciled = canonical.name === group.name
    && String(canonical.brand || "").toLowerCase() === String(group.brand || "").toLowerCase();
  if (alreadyReconciled) {
    const expectedOptions = new Set(group.options || []);
    const current = (canonical.product_variants || [])
      .filter((variant) => expectedOptions.size ? expectedOptions.has(variant.size) : !variant.size)
      .map((variant) => ({
        color: variant.color || "",
        size: variant.size || "",
        stockQuantity: Math.max(0, Number(variant.stock_quantity) || 0),
        image: variant.image || null,
      }));
    if (current.length) return current;
  }
  const variants = new Map();
  for (const option of group.options || []) {
    addVariant(variants, { size: option, stockQuantity: 0 });
  }

  for (const source of group.sources || []) {
    const product = productBySlug.get(source.slug);
    if (!product) throw new Error(`No existe el producto fuente ${source.slug}.`);
    addVariant(variants, {
      size: source.option || "",
      color: source.color || "",
      stockQuantity: productStock(product),
      image: product.image,
    });
  }

  for (const source of group.variantSources || []) {
    const product = productBySlug.get(source.slug);
    if (!product) throw new Error(`No existe el producto fuente ${source.slug}.`);
    const sourceVariant = (product.product_variants || []).find((variant) => (
      variant.size === source.fromOption && variant.color === (source.fromColor || "")
    ));
    if (!sourceVariant) throw new Error(`No existe la variante ${source.fromOption} de ${source.slug}.`);
    addVariant(variants, {
      size: source.option || "",
      color: source.color || "",
      stockQuantity: sourceVariant.stock_quantity,
      image: sourceVariant.image || product.image,
    });
  }

  for (const articleCode of group.inventoryCodes || []) {
    const record = inventoryByCode.get(articleCode);
    if (!record) throw new Error(`No existe el artículo ${articleCode} en el inventario fuente.`);
    const sourceProduct = productBySlug.get(inventorySlug(record));
    const parsed = parseInventoryVariant(record["Descripción del producto  "]);
    addVariant(variants, {
      ...parsed,
      color: group.preserveColors ? parsed.color : "",
      stockQuantity: Math.max(0, Number(record["existencia real"]) || 0),
      image: sourceProduct?.image || canonical.image,
    });
  }

  if ([...variants.values()].some((variant) => variant.color)) {
    for (const [key, variant] of variants) {
      if (!variant.color && variant.stockQuantity === 0) variants.delete(key);
    }
  }

  const existingByKey = new Map(
    (canonical.product_variants || []).map((variant) => [variantKey(variant.color, variant.size), variant])
  );
  for (const [key, variant] of variants) {
    const existing = existingByKey.get(key);
    if (existing?.image) variant.image = existing.image;
  }

  if (variants.size === 0) addVariant(variants, { stockQuantity: productStock(canonical), image: canonical.image });
  return [...variants.values()];
}

async function reconcileCatalog({ dryRun = false } = {}) {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,brand,presentation,sizes,stock_quantity,image,product_variants(id,color,size,stock_quantity,image)");
  if (error) throw error;

  const productBySlug = new Map((data || []).map((product) => [product.slug, product]));
  const inventoryByCode = new Map(inventory.map((record) => [String(record["Clave de artículo "]).trim(), record]));
  const plans = reconciliation.map((group) => {
    const canonical = productBySlug.get(group.canonicalSlug);
    const catalog = productBySlug.get(group.catalogSlug);
    if (!canonical) throw new Error(`No existe el producto principal ${group.canonicalSlug}.`);
    if (!catalog) throw new Error(`No existe el producto importado ${group.catalogSlug}.`);
    const variants = buildGroupVariants(group, productBySlug, inventoryByCode);
    return {
      group,
      canonical,
      variants,
      stockQuantity: variants.reduce((total, variant) => total + variant.stockQuantity, 0),
      colors: [...new Set(variants.map((variant) => variant.color).filter(Boolean))],
    };
  });

  for (const plan of plans) {
    console.log(`${dryRun ? "PREVIA" : "AGRUPANDO"}: ${plan.group.brand} / ${plan.group.name} -> ${plan.variants.length} variantes, ${plan.stockQuantity} unidades`);
  }
  if (dryRun) return plans;

  for (const { group, canonical, variants, colors } of plans) {
    const sizes = group.options || [];
    const { error: productError } = await supabase
      .from("products")
      .update({
        name: group.name,
        brand: group.brand,
        presentation: group.presentation || null,
        sizes: colors.length ? { sizes, colors } : (sizes.length ? sizes : null),
        quote_only: true,
      })
      .eq("id", canonical.id);
    if (productError) throw productError;

    const desiredKeys = new Set(variants.map((variant) => variantKey(variant.color, variant.size)));
    const obsoleteIds = (canonical.product_variants || [])
      .filter((variant) => !desiredKeys.has(variantKey(variant.color, variant.size)))
      .map((variant) => variant.id);
    if (obsoleteIds.length) {
      const { error: obsoleteError } = await supabase
        .from("product_variants")
        .update({ stock_quantity: 0 })
        .in("id", obsoleteIds);
      if (obsoleteError) throw obsoleteError;
    }

    const { error: variantsError } = await supabase.from("product_variants").upsert(
      variants.map((variant) => ({
        product_id: canonical.id,
        color: variant.color,
        size: variant.size,
        stock_quantity: variant.stockQuantity,
        image: variant.image || null,
      })),
      { onConflict: "product_id,color,size" }
    );
    if (variantsError) throw variantsError;
  }

  console.log(`Conciliación completada: ${plans.length} grupos, sin borrar productos ni variantes.`);
  return plans;
}

if (require.main === module) {
  reconcileCatalog({ dryRun: process.argv.includes("--dry-run") }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { reconcileCatalog };
