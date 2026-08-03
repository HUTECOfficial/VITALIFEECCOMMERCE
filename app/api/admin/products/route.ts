import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase/server";
import { productToRow } from "@/lib/admin-products";
import { productCategories, type Product } from "@/types";

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
  const stockQuantity = Math.max(0, Math.floor(Number(input.stockQuantity)));

  if (name.length < 2) return { error: "Escribe un nombre de al menos 2 caracteres." };
  if (!productCategories.includes(category as Product["category"])) return { error: "Selecciona una categoría válida." };
  if (!Number.isFinite(price) || price < 0) return { error: "El precio debe ser un número válido." };
  if (!Number.isFinite(stockQuantity)) return { error: "Las existencias deben ser un número válido." };

  const sizes = Array.isArray(input.sizes)
    ? input.sizes.filter((size): size is string => typeof size === "string").map((size) => size.trim()).filter(Boolean)
    : [];
  const colors = Array.isArray(input.colors)
    ? input.colors.filter((color): color is string => typeof color === "string").map((color) => color.trim()).filter(Boolean)
    : [];

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
    brand: typeof input.brand === "string" ? input.brand.trim() : undefined,
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
  return NextResponse.json(data, { status: 201 });
}
