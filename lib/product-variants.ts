import type { Product } from "@/types";

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
