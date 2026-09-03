import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const requestedScope = request.nextUrl.searchParams.get("scope");
  const scope = requestedScope ?? "catalog";
  if (scope !== "catalog" && scope !== "content") {
    return NextResponse.json({ error: "El destino de carga no es válido." }, { status: 400 });
  }

  const formData = await request.formData().catch(() => null);
  const image = formData?.get("image");
  if (!(image instanceof File)) return NextResponse.json({ error: "Selecciona una imagen válida." }, { status: 400 });
  if (!allowedTypes.has(image.type)) return NextResponse.json({ error: "Usa una imagen JPG, PNG o WebP." }, { status: 400 });
  if (image.size > MAX_IMAGE_SIZE) return NextResponse.json({ error: "La imagen no debe superar 5 MB." }, { status: 400 });

  const extension = allowedTypes.get(image.type)!;
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const filePath = `${scope}/${fileName}`;
  const supabase = createServerClient();
  const { error } = await supabase.storage
    .from("VITALIFE")
    .upload(filePath, Buffer.from(await image.arrayBuffer()), { contentType: image.type, upsert: false });

  if (error) {
    return NextResponse.json(
      { error: "No se pudo subir la imagen. Verifica que exista el bucket VITALIFE en Supabase Storage." },
      { status: 500 }
    );
  }

  const { data } = supabase.storage.from("VITALIFE").getPublicUrl(filePath);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
