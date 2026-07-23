import crypto from "crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  ensureSingleActiveSubscription,
  cancelOldPaidSubscriptions,
  activateFreePlan,
  isWebhookEventProcessed,
  recordWebhookEvent,
} from "@/lib/subscriptions";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = (await headers()).get("x-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", process.env.LEMON_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventName = event.meta?.event_name;
  const eventId = event.meta?.event_id || event.data?.id;

  console.log("Lemon event:", eventName, "| Event ID:", eventId);

  if (eventId && (await isWebhookEventProcessed(eventId))) {
    console.log("Event already processed:", eventId);
    return NextResponse.json({ success: true, message: "Already processed" });
  }

  const custom = event.meta?.custom_data || {};
  const userId = custom.user_id;
  const planId = custom.plan_id;


  /* ---------------------------------------------------- */
  /* SUBSCRIPTION CREATED (NEW SUBSCRIPTION) */
  /* ---------------------------------------------------- */

  if (eventName === "subscription_created") {
    const subscriptionId = event.data.id;
    const status = event.data.attributes.status;
    const orderId = event.data?.attributes?.order_id
      ? String(event.data.attributes.order_id)
      : null;

    if (!userId || !planId) {
      console.error("Missing user_id or plan_id in subscription_created");
      return NextResponse.json({ success: true });
    }

    const now = new Date();

    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 30);

    await prisma.userPlan.upsert({
      where: { subscriptionId },
      update: {
        status,
        isActive: status === "active",
        orderId,
      },
      create: {
        userId,
        planId,
        subscriptionId,
        orderId,
        status,
        startDate: now,
        endDate,
        isActive: status === "active",
      },
    });

    if (status === "active") {
      await cancelOldPaidSubscriptions(userId, subscriptionId);
    }

    await ensureSingleActiveSubscription(userId, subscriptionId);

    if (eventId) {
      await recordWebhookEvent(eventId, eventName, subscriptionId);
    }

    console.log("Subscription created and synced:", subscriptionId);
  }

  /* ---------------------------------------------------- */
  /* SUBSCRIPTION UPDATED (STATUS CHANGES) */
  /* ---------------------------------------------------- */

  if (eventName === "subscription_updated") {
    const subscriptionId = event.data.id;
    const status = event.data.attributes.status;
    const orderId = event.data?.attributes?.order_id
      ? String(event.data.attributes.order_id)
      : null;

    const existing = await prisma.userPlan.findUnique({
      where: { subscriptionId },
    });

    if (!existing) {
      console.warn("subscription_updated for unknown subscription:", subscriptionId);
      if (userId && planId) {
        await prisma.userPlan.create({
          data: {
            userId,
            planId,
            subscriptionId,
            orderId,
            status,
            startDate: new Date(),
            isActive: status === "active",
          },
        });
      }
    } else {
      await prisma.userPlan.update({
        where: { subscriptionId },
        data: {
          status,
          isActive: status === "active",
          orderId,
        },
      });

      if (status === "active") {
        await ensureSingleActiveSubscription(userId, subscriptionId);
      }
    }

    if (eventId) {
      await recordWebhookEvent(eventId, eventName, subscriptionId);
    }

    console.log("Subscription updated:", subscriptionId, "→", status);
  }

  /* ---------------------------------------------------- */
  /* SUBSCRIPTION CANCELLED */
  /* ---------------------------------------------------- */

  if (eventName === "subscription_cancelled") {
    const subscriptionId = event.data.id;

    await prisma.userPlan.updateMany({
      where: { subscriptionId },
      data: {
        status: "cancelled",
        isActive: false,
        endDate: new Date(),
      },
    });

    const userPlan = await prisma.userPlan.findFirst({
      where: { subscriptionId },
    });

    if (userPlan) {
      const hasActivePlan = await prisma.userPlan.findFirst({
        where: {
          userId: userPlan.userId,
          isActive: true,
        },
      });

      if (!hasActivePlan) {
        await activateFreePlan(userPlan.userId);
        console.log("Activated Free plan for user:", userPlan.userId);
      }
    }

    if (eventId) {
      await recordWebhookEvent(eventId, eventName, subscriptionId);
    }

    console.log("Subscription cancelled:", subscriptionId);
  }

  /* ---------------------------------------------------- */
  /* SUBSCRIPTION EXPIRED */
  /* ---------------------------------------------------- */

  if (eventName === "subscription_expired") {
    const subscriptionId = event.data.id;

    await prisma.userPlan.updateMany({
      where: { subscriptionId },
      data: {
        status: "expired",
        isActive: false,
        endDate: new Date(),
      },
    });

    const userPlan = await prisma.userPlan.findFirst({
      where: { subscriptionId },
    });

    if (userPlan) {
      const hasActivePlan = await prisma.userPlan.findFirst({
        where: {
          userId: userPlan.userId,
          isActive: true,
        },
      });

      if (!hasActivePlan) {
        await activateFreePlan(userPlan.userId);
        console.log("Activated Free plan for user:", userPlan.userId);
      }
    }

    if (eventId) {
      await recordWebhookEvent(eventId, eventName, subscriptionId);
    }

    console.log("Subscription expired:", subscriptionId);
  }

  /* ---------------------------------------------------- */
  /* ORDER EVENTS (LOGGING / ANALYTICS) */
  /* ---------------------------------------------------- */

  if (eventName === "order_created") {
    const orderId = event.data.id;
    console.log("Order created:", orderId);
    if (eventId) {
      await recordWebhookEvent(eventId, eventName);
    }
  }

  if (eventName === "payment_failed") {
    const subscriptionId = event.data?.attributes?.subscription_id;
    console.log("Payment failed for subscription:", subscriptionId);
    if (eventId) {
      await recordWebhookEvent(eventId, eventName, subscriptionId);
    }
  }

  /* ------------------------------------------------------------------ */
  /* UNHANDLED EVENTS */
  /* ------------------------------------------------------------------ */

  const handledEvents = [
    "subscription_created",
    "subscription_updated",
    "subscription_cancelled",
    "subscription_expired",
    "order_created",
    "payment_failed",
  ];

  if (!handledEvents.includes(eventName)) {
    console.log("ℹUnhandled event:", eventName);
    if (eventId) {
      await recordWebhookEvent(eventId, eventName);
    }
  }

  return NextResponse.json({ success: true });
}
