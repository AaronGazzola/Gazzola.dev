//-| File path: app/api/webhooks/stripe/route.ts
import { prisma } from "@/lib/prisma-client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === "paid" && session.metadata?.contractId) {
          await prisma.$transaction(async (tx) => {
            await tx.payment.updateMany({
              where: {
                stripeSessionId: session.id,
              },
              data: {
                status: "completed",
                stripePaymentIntentId: session.payment_intent as string,
                paidAt: new Date(),
              },
            });

            await tx.contract.update({
              where: {
                id: session.metadata?.contractId,
              },
              data: {
                isPaid: true,
              },
            });
          });

          console.log(
            `Payment completed for contract: ${session.metadata.contractId}`
          );
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.contractId) {
          await prisma.payment.updateMany({
            where: {
              stripeSessionId: session.id,
            },
            data: {
              status: "failed",
            },
          });

          console.log(
            `Payment session expired for contract: ${session.metadata.contractId}`
          );
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        if (paymentIntent.metadata?.contractId) {
          await prisma.payment.updateMany({
            where: {
              stripePaymentIntentId: paymentIntent.id,
            },
            data: {
              status: "failed",
            },
          });

          console.log(
            `Payment failed for contract: ${paymentIntent.metadata.contractId}`
          );
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        if (paymentIntent.metadata?.contractId) {
          await prisma.payment.updateMany({
            where: {
              stripePaymentIntentId: paymentIntent.id,
            },
            data: {
              status: "completed",
              paidAt: new Date(),
            },
          });

          console.log(
            `Payment succeeded for contract: ${paymentIntent.metadata.contractId}`
          );
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}