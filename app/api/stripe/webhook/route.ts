import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeWebhookSecret } from "@/lib/stripe";
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
    event = stripe.webhooks.constructEvent(
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
          await supabase
            .from("orders")
            .update({
              status: "paid",
              stripe_payment_intent:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : null,
              paid_at: new Date().toISOString(),
            })
            .eq("id", orderId);
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
