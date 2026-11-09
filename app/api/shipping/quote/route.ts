import { NextRequest, NextResponse } from "next/server";
import { quoteShipping, ShippingError } from "@/lib/envia";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const cp = typeof body.cp === "string" ? body.cp.trim() : "";
    const { options, location } = await quoteShipping({
      cp,
      city: typeof body.city === "string" ? body.city : undefined,
      colonia: typeof body.colonia === "string" ? body.colonia : undefined,
    });
    return NextResponse.json({ options, location: { city: location.city, state: location.stateName } });
  } catch (err) {
    if (err instanceof ShippingError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Error cotizando envío:", err);
    return NextResponse.json({ error: "No se pudo cotizar el envío. Intenta de nuevo." }, { status: 500 });
  }
}
