import reconciliationData from "@/data/catalog-reconciliation.json";
import inventoryData from "@/productos_extraidos.json";
import type { Product, ProductVariant } from "@/types";

type Source = {
  slug: string;
  option?: string;
  color?: string;
};

type VariantSource = Source & {
  fromOption: string;
  fromColor?: string;
};

type ReconciliationGroup = {
  catalogSlug: string;
  canonicalSlug: string;
  name: string;
  brand: string;
  presentation?: string;
  options: string[];
  sources?: Source[];
  variantSources?: VariantSource[];
  inventoryCodes?: string[];
  preserveColors?: boolean;
  hiddenSlugs?: string[];
};

type InventoryRecord = {
  "Clave de artículo ": string;
  "Descripción del producto  ": string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function inventorySlug(record: InventoryRecord) {
  return `${slugify(record["Descripción del producto  "])}-${slugify(record["Clave de artículo "])}`;
}

const groups = reconciliationData as ReconciliationGroup[];
const canonicalSlugs = new Set(groups.map((group) => group.canonicalSlug));
const inventoryByCode = new Map(
  (inventoryData as InventoryRecord[]).map((record) => [String(record["Clave de artículo "]).trim(), record])
);
const aliasEntries: Array<[string, string]> = [];

for (const group of groups) {
  const candidates = [
    group.catalogSlug,
    ...(group.sources?.map((source) => source.slug) ?? []),
    ...(group.variantSources?.map((source) => source.slug) ?? []),
    ...(group.hiddenSlugs ?? []),
    ...(group.inventoryCodes?.flatMap((code) => {
      const record = inventoryByCode.get(code);
      return record ? [inventorySlug(record)] : [];
    }) ?? []),
  ];
  for (const slug of candidates) {
    if (slug !== group.canonicalSlug && !canonicalSlugs.has(slug)) aliasEntries.push([slug, group.canonicalSlug]);
  }
}

const canonicalByHiddenSlug = new Map(aliasEntries);
const hiddenSlugs = new Set(canonicalByHiddenSlug.keys());

export function getCanonicalCatalogSlug(slug: string) {
  return canonicalByHiddenSlug.get(slug) ?? slug;
}

export function isCatalogProductVisibleSlug(slug: string) {
  return !hiddenSlugs.has(slug);
}

function variantKey(variant: Pick<ProductVariant, "color" | "size">) {
  return `${variant.color}\u0000${variant.size}`;
}

function mergeVariant(target: Map<string, ProductVariant>, variant: ProductVariant) {
  const key = variantKey(variant);
  const current = target.get(key);
  if (!current) {
    target.set(key, { ...variant });
    return;
  }
  current.stockQuantity += variant.stockQuantity;
  if (!current.image && variant.image) current.image = variant.image;
}

function localGroupProduct(group: ReconciliationGroup, productBySlug: Map<string, Product>) {
  const canonical = productBySlug.get(group.canonicalSlug);
  if (!canonical) return null;
  const variants = new Map<string, ProductVariant>();
  for (const option of group.options) mergeVariant(variants, { color: "", size: option, stockQuantity: 0 });

  if (group.inventoryCodes?.length && canonical.variants?.length) {
    for (const variant of canonical.variants) {
      mergeVariant(variants, { ...variant, color: group.preserveColors ? variant.color : "" });
    }
  }
  for (const source of group.sources ?? []) {
    const product = productBySlug.get(source.slug);
    if (!product) continue;
    mergeVariant(variants, {
      color: source.color ?? "",
      size: source.option ?? "",
      stockQuantity: product.stockQuantity ?? 0,
      image: product.image || undefined,
    });
  }
  for (const source of group.variantSources ?? []) {
    const product = productBySlug.get(source.slug);
    const variant = product?.variants?.find((candidate) => (
      candidate.size === source.fromOption && candidate.color === (source.fromColor ?? "")
    ));
    if (!variant) continue;
    mergeVariant(variants, {
      color: source.color ?? "",
      size: source.option ?? "",
      stockQuantity: variant.stockQuantity,
      image: variant.image ?? product?.image,
    });
  }

  if ([...variants.values()].some((variant) => variant.color)) {
    for (const [key, variant] of variants) {
      if (!variant.color && variant.stockQuantity === 0) variants.delete(key);
    }
  }

  const mergedVariants = [...variants.values()];
  const colors = [...new Set(mergedVariants.map((variant) => variant.color).filter(Boolean))];
  const stockQuantity = mergedVariants.reduce((total, variant) => total + variant.stockQuantity, 0);
  return {
    ...canonical,
    name: group.name,
    brand: group.brand,
    presentation: group.presentation,
    sizes: group.options.length ? group.options : undefined,
    colors: colors.length ? colors : undefined,
    variants: mergedVariants.length ? mergedVariants : canonical.variants,
    stockQuantity,
    inStock: stockQuantity > 0,
    quoteOnly: true,
  } satisfies Product;
}

export function reconcileLocalCatalogProducts(products: Product[]) {
  const sourceBySlug = new Map(products.map((product) => [product.slug, product]));
  const productBySlug = new Map(sourceBySlug);
  for (const group of groups) {
    const product = localGroupProduct(group, sourceBySlug);
    if (product) productBySlug.set(group.canonicalSlug, product);
  }
  return products
    .filter((product) => isCatalogProductVisibleSlug(product.slug))
    .map((product) => productBySlug.get(product.slug) ?? product);
}

export const catalogReconciliationGroups = groups;
