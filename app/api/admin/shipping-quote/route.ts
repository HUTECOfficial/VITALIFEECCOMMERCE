import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { quoteShipping, ShippingError } from "@/lib/envia";
import { parsePackage } from "@/lib/shipping-settings";

// Cotiza de nuevo con las medidas reales del paquete antes de generar la guía.
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "El cuerpo de la solicitud no es válido." }, { status: 400 });
  const pkg = parsePackage(body.package);
  if ("error" in pkg) return NextResponse.json(pkg, { status: 400 });
  const cp = typeof body.cp === "string" ? body.cp.trim() : "";

  try {
    const { options } = await quoteShipping(
      {
        cp,
        city: typeof body.city === "string" ? body.city : undefined,
        colonia: typeof body.colonia === "string" ? body.colonia : undefined,
      },
      pkg
    );
    return NextResponse.json({ options });
  } catch (err) {
    if (err instanceof ShippingError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("Error cotizando envío desde el CMS:", err);
    return NextResponse.json({ error: "No se pudo cotizar el envío. Intenta de nuevo." }, { status: 500 });
  }
}
