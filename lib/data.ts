import { createServerClient } from "@/lib/supabase/server";
import { products as localProducts } from "@/data/products";
import { Product } from "@/types";
import { readInventoryVariants, readProductVariants } from "@/lib/product-variants";

const localStockBySlug = new Map(
  localProducts.map((product) => [product.slug, product.stockQuantity])
);

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: Product["category"];
  price?: number | null;
  description?: string | null;
  image?: string | null;
  in_stock?: boolean | null;
  stock_quantity?: number | null;
  featured?: boolean | null;
  sizes?: unknown;
  quote_only?: boolean | null;
  brand?: string | null;
  presentation?: string | null;
  product_variants?: unknown;
};

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    price: row.price ?? 0,
    description: row.description ?? "",
    image: row.image ?? "",
    inStock: row.in_stock ?? false,
    stockQuantity: row.stock_quantity ?? localStockBySlug.get(row.slug),
    featured: row.featured ?? false,
    ...readProductVariants(row.sizes),
    variants: readInventoryVariants(row.product_variants),
    quoteOnly: row.quote_only ?? false,
    brand: row.brand ?? undefined,
    presentation: row.presentation ?? undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(color,size,stock_quantity)")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return localProducts;
    }
    return (data as ProductRow[]).map(mapRowToProduct);
  } catch {
    return localProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(color,size,stock_quantity)")
      .eq("slug", slug)
      .single();
    if (error || !data) {
      return localProducts.find((p) => p.slug === slug) ?? null;
    }
    return mapRowToProduct(data as ProductRow);
  } catch {
    return localProducts.find((p) => p.slug === slug) ?? null;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(color,size,stock_quantity)")
      .eq("featured", true);
    if (error || !data || data.length === 0) {
      return localProducts.filter((p) => p.featured);
    }
    return (data as ProductRow[]).map(mapRowToProduct);
  } catch {
    return localProducts.filter((p) => p.featured);
  }
}

export async function getCategories() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
