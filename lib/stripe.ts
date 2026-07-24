import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY no está configurada en las variables de entorno");
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-06-18.basil" as Stripe.LatestApiVersion,
    });
  }
  return stripeInstance;
}

export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
