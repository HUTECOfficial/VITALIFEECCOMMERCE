import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { products as localProducts } from "@/data/products";

function mapRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    price: row.price ?? 0,
    description: row.description ?? "",
    image: row.image ?? "",
    inStock: row.in_stock ?? false,
    featured: row.featured ?? false,
    sizes: row.sizes ?? undefined,
    quoteOnly: row.quote_only ?? false,
  };
}

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json(localProducts);
    }

    return NextResponse.json(data.map(mapRow));
  } catch {
    return NextResponse.json(localProducts);
  }
}
