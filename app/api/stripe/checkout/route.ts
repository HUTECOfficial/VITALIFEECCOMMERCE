import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";
import { calculateCheckoutTotals, STRIPE_MINIMUM_ORDER_MXN } from "@/lib/checkout";

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
  items: CheckoutItem[];
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

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Tu carrito está vacío" }, { status: 400 });
    }

    const productIds = [...new Set(body.items.map((item) => item.productId).filter(Boolean))] as string[];
    if (productIds.length === 0 || body.items.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      return NextResponse.json({ error: "El carrito contiene productos o cantidades inválidas" }, { status: 400 });
    }

    const { data: catalogProducts, error: catalogError } = await supabase
      .from("products")
      .select("id, name, price, in_stock, stock_quantity")
      .in("id", productIds);

    if (catalogError || !catalogProducts || catalogProducts.length !== productIds.length) {
      return NextResponse.json({ error: "No se pudieron validar los productos del carrito" }, { status: 400 });
    }

    const catalogById = new Map(catalogProducts.map((product) => [product.id, product]));
    const requestedQuantityByProduct = new Map<string, number>();
    for (const item of body.items) {
      requestedQuantityByProduct.set(item.productId!, (requestedQuantityByProduct.get(item.productId!) ?? 0) + item.quantity);
    }
    const items: Array<{ productId: string; name: string; price: number; quantity: number; size?: string }> = [];
    for (const item of body.items) {
      const product = catalogById.get(item.productId!);
      const requestedQuantity = requestedQuantityByProduct.get(item.productId!) ?? 0;
      if (!product || !product.in_stock || Number(product.stock_quantity) < requestedQuantity || Number(product.price) <= 0) {
        return NextResponse.json(
          { error: `El producto \"${item.name}\" no está disponible para compra en línea` },
          { status: 400 }
        );
      }
      items.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: item.quantity,
        size: item.size,
      });
    }

    const totals = calculateCheckoutTotals(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
    if (totals.total < STRIPE_MINIMUM_ORDER_MXN) {
      return NextResponse.json(
        { error: `El monto mínimo de compra para pagar con tarjeta es de $${STRIPE_MINIMUM_ORDER_MXN.toFixed(2)} MXN.` },
        { status: 400 }
      );
    }

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
        subtotal: totals.subtotal,
        iva: totals.iva,
        total: totals.total,
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

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      price: item.price,
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
      line_items: [
        ...items.map((item) => ({
          price_data: {
            currency: "mxn",
            product_data: {
              name: item.name + (item.size ? ` (${item.size})` : ""),
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        ...(totals.iva > 0
          ? [{
              price_data: {
                currency: "mxn",
                product_data: { name: "IVA (16%)" },
                unit_amount: Math.round(totals.iva * 100),
              },
              quantity: 1,
            }]
          : []),
      ],
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
