import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";

interface CheckoutItem {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface CheckoutPayload {
  firstName: string;
  lastName: string;
  address: string;
  colonia: string;
  city: string;
  cp: string;
  phone: string;
  subtotal: number;
  iva: number;
  total: number;
  items: CheckoutItem[];
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY no está configurada en Vercel" },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SECRET_KEY) {
      return NextResponse.json(
        { error: "SUPABASE_SECRET_KEY no está configurada en Vercel" },
        { status: 500 }
      );
    }

    const body: CheckoutPayload = await request.json();

    const supabase = createServerClient();

    const subtotal = round2(body.subtotal);
    const iva = round2(body.iva);
    const total = round2(body.total);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        first_name: body.firstName,
        last_name: body.lastName,
        address: body.address,
        colonia: body.colonia,
        city: body.city,
        cp: body.cp,
        phone: body.phone,
        subtotal,
        iva,
        total,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Error creando orden:", orderError);
      return NextResponse.json(
        { error: "No se pudo crear el pedido" },
        { status: 500 }
      );
    }

    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId || null,
      name: item.name,
      price: round2(item.price),
      quantity: item.quantity,
      size: item.size || null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error guardando items:", itemsError);
      return NextResponse.json(
        { error: "No se pudieron guardar los productos del pedido" },
        { status: 500 }
      );
    }

    const origin = request.nextUrl.origin;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: body.items.map((item) => ({
        price_data: {
          currency: "mxn",
          product_data: {
            name: item.name + (item.size ? ` (${item.size})` : ""),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        order_id: order.id,
        customer_name: `${body.firstName} ${body.lastName}`,
        phone: body.phone,
      },
      success_url: `${origin}/checkout/success?order=${order.id}`,
      cancel_url: `${origin}/checkout/cancelled?order=${order.id}`,
      locale: "es",
    });

    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: "Error al crear la sesión de pago",
        details: message,
      },
      { status: 500 }
    );
  }
}
