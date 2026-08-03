import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { products as localProducts } from "@/data/products";
import type { Product } from "@/types";
import { readProductVariants } from "@/lib/product-variants";

const cacheHeaders = {
  // Product images and stock are managed in Supabase. Do not let the browser
  // keep a stale catalog after an admin or importer updates a product image.
  "Cache-Control": "no-store, max-age=0",
};

const localStockBySlug = new Map(
  localProducts.map((product) => [product.slug, product.stockQuantity])
);

interface ProductRow {
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
}

function mapRow(row: ProductRow): Product {
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
    quoteOnly: row.quote_only ?? false,
    brand: row.brand ?? undefined,
    presentation: row.presentation ?? undefined,
  };
}

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("products")
      // Select all fields until the stock migration has reached every
      // environment; the response is still mapped to the public shape above.
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json(localProducts, { headers: cacheHeaders });
    }

    return NextResponse.json(data.map(mapRow), { headers: cacheHeaders });
  } catch {
    return NextResponse.json(localProducts, { headers: cacheHeaders });
  }
}
