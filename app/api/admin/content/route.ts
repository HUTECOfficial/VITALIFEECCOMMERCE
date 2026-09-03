import { NextRequest, NextResponse } from "next/server";
import {
  isSiteContentPage,
  isSiteContentSection,
  validateSiteContentSection,
} from "@/data/siteContent";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isMissingTableError(error: { code?: string; message?: string }) {
  return error.code === "42P01" || error.code === "PGRST205" || error.message?.includes("relation \"site_content\" does not exist");
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body)) return NextResponse.json({ error: "El cuerpo de la solicitud no es válido." }, { status: 400 });
  const extraField = Object.keys(body).find((field) => !["page", "section", "content"].includes(field));
  if (extraField) return NextResponse.json({ error: `El campo “${extraField}” no está permitido.` }, { status: 400 });
  if (!isSiteContentPage(body.page)) return NextResponse.json({ error: "La página no es válida." }, { status: 400 });
  if (!isSiteContentSection(body.page, body.section)) return NextResponse.json({ error: "La sección no es válida para esta página." }, { status: 400 });
  const parsed = validateSiteContentSection(body.page, body.section, body.content);
  if ("error" in parsed) return NextResponse.json(parsed, { status: 400 });

  const { data, error } = await createServerClient()
    .from("site_content")
    .upsert({ page: body.page, section: body.section, content: parsed.content }, { onConflict: "page,section" })
    .select("updated_at")
    .single();

  if (error) {
    const message = isMissingTableError(error)
      ? "No existe la tabla de contenido. Aplica la migración 009_site_content.sql en Supabase."
      : "No se pudo guardar la sección en Supabase.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({
    page: body.page,
    section: body.section,
    content: parsed.content,
    updatedAt: data.updated_at,
  });
}
