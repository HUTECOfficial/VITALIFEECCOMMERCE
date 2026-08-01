import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase/server";
import { productToRow } from "@/lib/admin-products";
import { parseProductInput } from "@/app/api/admin/products/route";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const product = parseProductInput(await request.json());
  if ("error" in product) return NextResponse.json(product, { status: 400 });
  const { id } = await params;
  const supabase = createServerClient();
  const { data, error } = await supabase.from("products").update(productToRow({ ...product, id })).eq("id", id).select().single();
  if (error) {
    const message = error.code === "23505" ? "Ya existe un producto con ese slug." : "No se pudo actualizar el producto.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: Context) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const supabase = createServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "No se pudo eliminar el producto." }, { status: 400 });
  return NextResponse.json({ success: true });
}
