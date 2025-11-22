import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();

  const headerList = await headers();

  const signature = headerList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      "[STRIPE_WEBHOOK_ERROR] Signature verification failed:",
      error
    );
    return new Response("Webhook Error: Invalid signature", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Log every event type you receive. Maybe it's not 'checkout.session.completed'?
  console.log("[STRIPE_EVENT] Received event:", event.type);

  if (event.type === "checkout.session.completed") {
    console.log("[STRIPE_SUCCESS] Handling checkout.session.completed");
    console.log("[STRIPE_METADATA] Session Metadata:", session.metadata);
    const courseId = session.metadata?.courseId;
    const enrollmentId = session.metadata?.enrollmentId;
    const customerId = session.customer as string;

    if (!courseId) {
      console.error(
        "[STRIPE_FAILURE] Missing metadata: courseId or enrollmentId"
      );
      throw new Error("Course ID not found");
    }

    console.log(`[STRIPE_LOOKUP] Finding user with customerId: ${customerId}`);
    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!user) {
      console.error(
        "[STRIPE_FAILURE] User not found with customerId:",
        customerId
      );
      throw new Error("User not found");
    }

    console.log(`[STRIPE_UPDATE] Found user: ${user.id}`);
    console.log(`[STRIPE_UPDATE] Updating enrollmentId: ${enrollmentId}`);

    await prisma.enrollment.update({
      where: {
        id: session.metadata?.enrollmentId as string,
      },
      data: {
        userId: user.id,
        courseId: courseId,
        amount: session.amount_total as number,
        status: "Active",
      },
    });
    console.log(
      `[STRIPE_SUCCESS] Successfully updated enrollment ${enrollmentId} to active.`
    );
  }

  return new Response(null, {
    status: 200,
  });
}
