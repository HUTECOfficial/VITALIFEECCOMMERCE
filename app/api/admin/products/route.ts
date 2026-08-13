import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase/server";
import { productToRow } from "@/lib/admin-products";
import { productCategories, type Product, type ProductVariant } from "@/types";
import { readProductVariants } from "@/lib/product-variants";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parseProductInput(value: unknown): Omit<Product, "id"> | { error: string } {
  if (!value || typeof value !== "object") return { error: "Datos de producto inválidos." };
  const input = value as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const category = typeof input.category === "string" ? input.category : "";
  const price = Number(input.price);
  const suppliedStockQuantity = Math.max(0, Math.floor(Number(input.stockQuantity)));

  if (name.length < 2) return { error: "Escribe un nombre de al menos 2 caracteres." };
  if (!productCategories.includes(category as Product["category"])) return { error: "Selecciona una categoría válida." };
  if (!Number.isFinite(price) || price < 0) return { error: "El precio debe ser un número válido." };
  if (!Number.isFinite(suppliedStockQuantity)) return { error: "Las existencias deben ser un número válido." };

  const sizes = Array.isArray(input.sizes)
    ? input.sizes.filter((size): size is string => typeof size === "string").map((size) => size.trim()).filter(Boolean)
    : [];
  const colors = Array.isArray(input.colors)
    ? input.colors.filter((color): color is string => typeof color === "string").map((color) => color.trim()).filter(Boolean)
    : [];

  let variants: ProductVariant[];
  if (Array.isArray(input.variants)) {
    const seen = new Set<string>();
    variants = [];
    for (const value of input.variants) {
      if (!value || typeof value !== "object") return { error: "Una variante de inventario no es válida." };
      const variant = value as Record<string, unknown>;
      const color = typeof variant.color === "string" ? variant.color.trim() : "";
      const size = typeof variant.size === "string" ? variant.size.trim() : "";
      const stockQuantity = Math.floor(Number(variant.stockQuantity));
      const key = `${color}\u0000${size}`;
      if (!Number.isFinite(stockQuantity) || stockQuantity < 0) return { error: "El stock de cada variante debe ser un entero mayor o igual a cero." };
      if (seen.has(key)) return { error: "No puede haber variantes de inventario repetidas." };
      if ((colors.length ? !colors.includes(color) : Boolean(color)) || (sizes.length ? !sizes.includes(size) : Boolean(size))) {
        return { error: "Cada variante debe corresponder a un color y una talla/medida del producto." };
      }
      seen.add(key);
      variants.push({ color, size, stockQuantity });
    }
    if (!variants.length) return { error: "Agrega al menos una variante de inventario." };
  } else {
    variants = [{ color: "", size: "", stockQuantity: suppliedStockQuantity }];
  }

  const stockQuantity = variants.reduce((total, variant) => total + variant.stockQuantity, 0);

  return {
    name,
    slug: slugify(typeof input.slug === "string" && input.slug.trim() ? input.slug : name),
    category: category as Product["category"],
    price,
    description: typeof input.description === "string" ? input.description.trim() : "",
    image: typeof input.image === "string" ? input.image.trim() : "",
    inStock: stockQuantity > 0,
    stockQuantity,
    featured: input.featured === true,
    sizes: sizes.length ? sizes : undefined,
    quoteOnly: input.quoteOnly === true,
    colors: colors.length ? colors : undefined,
    variants,
    brand: typeof input.brand === "string" ? input.brand.trim() : undefined,
    presentation: typeof input.presentation === "string" ? input.presentation.trim() : undefined,
  };
}

export async function replaceProductVariants(
  supabase: ReturnType<typeof createServerClient>,
  productId: string,
  variants: ProductVariant[] | undefined
) {
  const { error: deleteError } = await supabase.from("product_variants").delete().eq("product_id", productId);
  if (deleteError) throw deleteError;
  const { error: insertError } = await supabase.from("product_variants").insert(
    (variants ?? []).map((variant) => ({
      product_id: productId,
      color: variant.color,
      size: variant.size,
      stock_quantity: variant.stockQuantity,
    }))
  );
  if (insertError) throw insertError;
}

export function productResponse(row: Record<string, unknown>, product: Omit<Product, "id"> & { id: string }): Product {
  return {
    ...product,
    id: product.id,
    ...readProductVariants(row.sizes),
    stockQuantity: Number(row.stock_quantity ?? product.stockQuantity ?? 0),
    inStock: Boolean(row.in_stock),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const supabase = createServerClient();
  const { data, error } = await supabase.from("products").select("*").order("name", { ascending: true });
  if (error) return NextResponse.json({ error: "No se pudo cargar el catálogo" }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const product = parseProductInput(await request.json());
  if ("error" in product) return NextResponse.json(product, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase.from("products").insert(productToRow({ ...product, id: "" })).select().single();
  if (error) {
    const message = error.code === "23505" ? "Ya existe un producto con ese slug." : "No se pudo crear el producto.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  try {
    await replaceProductVariants(supabase, data.id, product.variants);
  } catch {
    await supabase.from("products").delete().eq("id", data.id);
    return NextResponse.json({ error: "No se pudieron guardar las variantes. Aplica la migración 008_product_variant_stock.sql." }, { status: 400 });
  }
  const { data: saved } = await supabase.from("products").select("*").eq("id", data.id).single();
  return NextResponse.json(productResponse(saved ?? data, { ...product, id: data.id }), { status: 201 });
}
