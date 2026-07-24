import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-18.basil" as Stripe.LatestApiVersion,
});

export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
