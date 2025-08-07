//-| File path: app/api/payment/route.ts
import { prisma } from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.redirect(
        new URL("/?error=missing_session_id", request.url)
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.redirect(
        new URL("/?error=invalid_session", request.url)
      );
    }

    const payment = await prisma.payment.findUnique({
      where: {
        stripeSessionId: sessionId,
      },
      include: {
        contract: true,
      },
    });

    if (!payment) {
      return NextResponse.redirect(
        new URL("/?error=payment_not_found", request.url)
      );
    }

    if (session.payment_status === "paid" && session.metadata?.contractId) {
      await prisma.$transaction(async (tx) => {
        // Use secure payment processing function with validation
        await tx.$executeRaw`
          SELECT process_payment_securely(
            ${sessionId}::TEXT,
            ${session.payment_intent as string}::TEXT,
            ${payment.amount}::DECIMAL,
            ${session.metadata?.contractId}::TEXT
          )
        `;
      });

      return NextResponse.redirect(new URL("/?payment=success", request.url));
    }

    if (session.payment_status === "unpaid") {
      return NextResponse.redirect(
        new URL("/?error=payment_incomplete", request.url)
      );
    }

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    return NextResponse.redirect(
      new URL("/?error=payment_processing_failed", request.url)
    );
  }
}