import type { Product, ProductVariant } from "@/types";

function stringValues(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function readProductVariants(value: unknown): Pick<Product, "sizes" | "colors"> {
  if (Array.isArray(value)) {
    const sizes = stringValues(value);
    return { sizes: sizes.length ? sizes : undefined };
  }

  if (value && typeof value === "object") {
    const variants = value as { sizes?: unknown; colors?: unknown };
    const sizes = stringValues(variants.sizes);
    const colors = stringValues(variants.colors);
    return {
      sizes: sizes.length ? sizes : undefined,
      colors: colors.length ? colors : undefined,
    };
  }

  return {};
}

export function productVariantsToStorage(product: Product) {
  if (product.colors?.length) {
    return {
      sizes: product.sizes ?? [],
      colors: product.colors,
    };
  }

  return product.sizes ?? null;
}

export function readInventoryVariants(value: unknown): ProductVariant[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const variants = value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as { color?: unknown; size?: unknown; stock_quantity?: unknown; stockQuantity?: unknown; image?: unknown };
    const stockQuantity = Number(row.stock_quantity ?? row.stockQuantity);
    if (!Number.isFinite(stockQuantity)) return [];
    return [{
      color: typeof row.color === "string" ? row.color : "",
      size: typeof row.size === "string" ? row.size : "",
      stockQuantity: Math.max(0, Math.floor(stockQuantity)),
      image: typeof row.image === "string" && row.image.trim() ? row.image : undefined,
    }];
  });

  return variants.length ? variants : undefined;
}

export function getVariantStock(product: Product, size?: string | null, color?: string | null): number | undefined {
  if (!product.variants?.length) return product.stockQuantity;
  return product.variants.find((variant) => variant.size === (size ?? "") && variant.color === (color ?? ""))?.stockQuantity;
}

export function getVariantImage(product: Product, size?: string | null, color?: string | null): string | undefined {
  const variants = product.variants ?? [];
  const selectedSize = size ?? "";
  const selectedColor = color ?? "";
  const exactImage = variants.find(
    (variant) => variant.size === selectedSize && variant.color === selectedColor && variant.image
  )?.image;
  if (exactImage) return exactImage;

  if (selectedColor) {
    const colorImage = variants.find((variant) => variant.color === selectedColor && variant.image)?.image;
    if (colorImage) return colorImage;
  }
  if (selectedSize) {
    return variants.find((variant) => variant.size === selectedSize && variant.image)?.image;
  }
  return undefined;
}
