import { NextRequest, NextResponse } from "next/server";
import { getStripe, stripeWebhookSecret } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Falta la firma de Stripe" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret
    );
  } catch (err) {
    console.error("Error verificando webhook:", err);
    return NextResponse.json(
      { error: "Firma de webhook inválida" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.order_id;

        if (orderId) {
          const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : null;
          const { error } = await supabase.rpc("finalize_paid_order", {
            p_order_id: orderId,
            p_payment_intent: paymentIntent,
          });
          if (error) {
            // Keeps payments working during deployment, before migration 005 has been applied.
            // Once applied, the RPC above is used because it decrements stock atomically.
            console.warn("No se pudo ejecutar finalize_paid_order; usando compatibilidad temporal.", error.message);
            const { data: paidOrders, error: orderError } = await supabase
              .from("orders")
              .update({ status: "paid", stripe_payment_intent: paymentIntent, paid_at: new Date().toISOString() })
              .eq("id", orderId)
              .eq("status", "pending")
              .select("id");
            if (orderError || !paidOrders?.length) break;

            const { data: items, error: itemsError } = await supabase
              .from("order_items")
              .select("product_id,quantity")
              .eq("order_id", orderId)
              .not("product_id", "is", null);
            if (itemsError) throw itemsError;

            for (const item of items ?? []) {
              const { data: product, error: productError } = await supabase
                .from("products")
                .select("stock_quantity")
                .eq("id", item.product_id)
                .single();
              if (productError || !product) continue;
              const stockQuantity = Math.max(0, Number(product.stock_quantity ?? 0) - Number(item.quantity ?? 0));
              await supabase
                .from("products")
                .update({ stock_quantity: stockQuantity, in_stock: stockQuantity > 0 })
                .eq("id", item.product_id);
            }
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.order_id;

        if (orderId) {
          await supabase
            .from("orders")
            .update({ status: "payment_failed" })
            .eq("id", orderId);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const orderId = charge.metadata?.order_id;

        if (orderId) {
          await supabase
            .from("orders")
            .update({ status: "refunded" })
            .eq("id", orderId);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const orderId = session.metadata?.order_id;

        if (orderId) {
          await supabase
            .from("orders")
            .update({ status: "expired" })
            .eq("id", orderId);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error procesando webhook:", err);
    return NextResponse.json(
      { error: "Error procesando el webhook" },
      { status: 500 }
    );
  }
}
