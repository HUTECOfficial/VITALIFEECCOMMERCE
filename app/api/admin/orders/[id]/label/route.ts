import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase/server";
import { getAdminOrder } from "@/lib/admin-orders";
import { cancelLabel, generateLabel, ShippingError } from "@/lib/envia";
import { parseAddress, parsePackage } from "@/lib/shipping-settings";

type Context = { params: Promise<{ id: string }> };

// Si una generación anterior se quedó colgada, el bloqueo se libera después de este tiempo.
const LABEL_LOCK_MS = 2 * 60 * 1000;

function isMissingColumnError(error: { code?: string } | null) {
  return error?.code === "PGRST204" || error?.code === "42703";
}

const MIGRATION_MESSAGE = "Faltan las columnas de guías. Aplica la migración 012_shipping_labels_settings.sql en Supabase.";

export async function POST(request: NextRequest, { params }: Context) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "El cuerpo de la solicitud no es válido." }, { status: 400 });

  const order = await getAdminOrder(id);
  if (!order) return NextResponse.json({ error: "No encontramos el pedido." }, { status: 404 });
  if (order.status !== "paid") return NextResponse.json({ error: "Solo se pueden generar guías de pedidos pagados." }, { status: 400 });
  if (order.trackingNumber) return NextResponse.json({ error: "Este pedido ya tiene una guía. Cancélala antes de generar otra." }, { status: 409 });

  const destination = parseAddress({ ...body.destination, company: "", state: "" }, "destino");
  if ("error" in destination) return NextResponse.json(destination, { status: 400 });
  const pkg = parsePackage(body.package);
  if ("error" in pkg) return NextResponse.json(pkg, { status: 400 });
  const carrier = typeof body.carrier === "string" ? body.carrier.trim() : "";
  const service = typeof body.service === "string" ? body.service.trim() : "";
  if (!carrier || !service) return NextResponse.json({ error: "Elige la paquetería y el servicio." }, { status: 400 });

  // Bloquea el pedido para no pagar dos guías si se hace doble clic o hay dos pestañas abiertas.
  const supabase = createServerClient();
  const now = new Date();
  const { data: claimed, error: claimError } = await supabase
    .from("orders")
    .update({ shipping_label_requested_at: now.toISOString() })
    .eq("id", id)
    .is("tracking_number", null)
    .or(`shipping_label_requested_at.is.null,shipping_label_requested_at.lt.${new Date(now.getTime() - LABEL_LOCK_MS).toISOString()}`)
    .select("id");
  if (isMissingColumnError(claimError)) return NextResponse.json({ error: MIGRATION_MESSAGE }, { status: 500 });
  if (claimError) return NextResponse.json({ error: "No se pudo preparar el pedido para generar la guía." }, { status: 500 });
  if (!claimed?.length) return NextResponse.json({ error: "Ya se está generando una guía para este pedido. Espera un momento y recarga." }, { status: 409 });

  const releaseLock = () => supabase.from("orders").update({ shipping_label_requested_at: null }).eq("id", id);

  let label;
  try {
    label = await generateLabel({
      carrier,
      service,
      destination,
      package: pkg,
      declaredValue: order.subtotal,
      orderReference: id.slice(0, 8).toUpperCase(),
    });
  } catch (err) {
    await releaseLock();
    if (err instanceof ShippingError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("Error generando guía:", err);
    return NextResponse.json({ error: "No se pudo conectar con Envia. Intenta de nuevo." }, { status: 502 });
  }

  const { error: saveError } = await supabase
    .from("orders")
    .update({
      shipping_carrier: label.carrier,
      shipping_service: label.service,
      tracking_number: label.trackingNumber,
      tracking_url: label.trackUrl || null,
      shipping_label_url: label.labelUrl || null,
      shipping_label_cost: label.price,
      shipping_label_created_at: new Date().toISOString(),
      shipping_label_requested_at: null,
      envia_shipment_id: label.shipmentId,
    })
    .eq("id", id);
  if (saveError) {
    // La guía ya existe y se cobró en Envia: se muestra el número para no perderlo.
    console.error("Guía generada pero no guardada:", id, label, saveError);
    return NextResponse.json(
      { error: `La guía ${label.trackingNumber} se generó en Envia, pero no se pudo guardar en el pedido. Anota el número y descarga la etiqueta: ${label.labelUrl}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ order: await getAdminOrder(id) });
}

export async function DELETE(request: NextRequest, { params }: Context) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) return NextResponse.json({ error: "No encontramos el pedido." }, { status: 404 });
  if (!order.trackingNumber || !order.shippingCarrier) return NextResponse.json({ error: "Este pedido no tiene guía." }, { status: 400 });

  let result;
  try {
    result = await cancelLabel(order.shippingCarrier, order.trackingNumber);
  } catch (err) {
    if (err instanceof ShippingError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("Error cancelando guía:", err);
    return NextResponse.json({ error: "No se pudo conectar con Envia. Intenta de nuevo." }, { status: 502 });
  }

  const { error } = await createServerClient()
    .from("orders")
    .update({
      tracking_number: null,
      tracking_url: null,
      shipping_label_url: null,
      shipping_label_cost: null,
      shipping_label_created_at: null,
      shipping_label_requested_at: null,
      envia_shipment_id: null,
    })
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: `La guía ${order.trackingNumber} se canceló en Envia, pero no se pudo actualizar el pedido.` }, { status: 500 });
  }

  return NextResponse.json({ order: await getAdminOrder(id), balanceReturned: result.balanceReturned });
}
