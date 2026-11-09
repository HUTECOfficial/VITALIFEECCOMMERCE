import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase/server";
import { lookupPostalCode } from "@/lib/envia";
import { parseShippingSettings } from "@/lib/shipping-settings";

function isMissingTableError(error: { code?: string; message?: string }) {
  return error.code === "42P01" || error.code === "PGRST205" || Boolean(error.message?.includes("shipping_settings"));
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = parseShippingSettings(await request.json().catch(() => null));
  if ("error" in parsed) return NextResponse.json(parsed, { status: 400 });

  // El estado lo pide Envia con su propio código, así que se toma del código postal.
  const location = await lookupPostalCode(parsed.origin.postalCode).catch(() => null);
  if (!location) return NextResponse.json({ error: "No encontramos el código postal de origen." }, { status: 400 });
  const settings = { ...parsed, origin: { ...parsed.origin, state: location.state } };

  const { error } = await createServerClient()
    .from("shipping_settings")
    .upsert({ id: true, settings }, { onConflict: "id" });
  if (error) {
    const message = isMissingTableError(error)
      ? "No existe la tabla de configuración de envíos. Aplica la migración 012_shipping_labels_settings.sql en Supabase."
      : "No se pudo guardar la configuración de envíos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ settings, stateName: location.stateName });
}
