import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
    ensureSingleActiveSubscription,
    cancelOldPaidSubscriptions,
    activateFreePlan,
    isWebhookEventProcessed,
    recordWebhookEvent,
} from "@/lib/subscriptions";
import Stripe from "stripe";
import { buildPaymentSuccessEmail, sendMail } from "@/lib/mailer";


export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const eventType = event.type;
    const eventId = event.id;

    console.log("Stripe event:", eventType, "| Event ID:", eventId);

    if (await isWebhookEventProcessed(eventId)) {
        console.log("Event already processed:", eventId);
        return NextResponse.json({ success: true, message: "Already processed" });
    }

    /* ---------------------------------------------------- */
    /* 1. INITIAL PURCHASE (Checkout Completed)             */
    /* ---------------------------------------------------- */
    if (eventType === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        const orderId = session.invoice as string;
        const userEmail = session.customer_details?.email;

        console.log("order id:", orderId)

        if (!userId || !planId) {
            console.error("Missing metadata in checkout.session.completed");
            // Still return 200 so Stripe stops retrying a malformed request
            return NextResponse.json({ received: true });
        }

        const now = new Date();
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + 30);

        await prisma.userPlan.upsert({
            where: { subscriptionId },
            update: { status: "active", isActive: true },
            create: {
                userId,
                planId,
                orderId,
                subscriptionId,
                status: "active",
                startDate: now,
                endDate,
                isActive: true,
            },
        });

        // Send Email Notification
        if (userEmail) {
            try {
                // You can fetch the plan name from your planId or just use metadata if you passed it
                const planName = session.metadata?.planName || "Subscription";

                await sendMail({
                    to: userEmail,
                    subject: "Welcome to HashTurn Tools - Payment Confirmed",
                    html: buildPaymentSuccessEmail(planName, orderId),
                });
            } catch (error) {
                console.error("Email failed to send:", error);
            }
        }

        await cancelOldPaidSubscriptions(userId, subscriptionId);
        await ensureSingleActiveSubscription(userId, subscriptionId);
        await recordWebhookEvent(eventId, eventType, subscriptionId);

        console.log("Stripe Subscription created and synced:", subscriptionId);
    }

    /* ---------------------------------------------------- */
    /* 2. SUBSCRIPTION UPDATED                              */
    /* ---------------------------------------------------- */
    if (eventType === "customer.subscription.updated") {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;
        const status = subscription.status;
        const isActive = status === "active";

        const existing = await prisma.userPlan.findUnique({
            where: { subscriptionId },
        });

        if (existing) {
            await prisma.userPlan.update({
                where: { subscriptionId },
                data: { status, isActive },
            });

            if (isActive) {
                await ensureSingleActiveSubscription(existing.userId, subscriptionId);
            }
        }

        await recordWebhookEvent(eventId, eventType, subscriptionId);
    }

    /* ---------------------------------------------------- */
    /* 3. SUBSCRIPTION DELETED                              */
    /* ---------------------------------------------------- */
    if (eventType === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;

        const userPlan = await prisma.userPlan.findFirst({
            where: { subscriptionId },
        });

        if (userPlan) {
            await prisma.userPlan.update({
                where: { subscriptionId },
                data: {
                    status: "cancelled",
                    isActive: false,
                    endDate: new Date(),
                },
            });

            const hasActivePlan = await prisma.userPlan.findFirst({
                where: { userId: userPlan.userId, isActive: true },
            });

            if (!hasActivePlan) {
                await activateFreePlan(userPlan.userId);
            }
        }

        await recordWebhookEvent(eventId, eventType, subscriptionId);
    }

    /* ---------------------------------------------------- */
    /* 4. PAYMENT FAILED                                    */
    /* ---------------------------------------------------- */
    if (eventType === "invoice.payment_failed") {
        const invoice = event.data.object as any;
        const subscriptionId = typeof invoice.subscription === 'string'
            ? invoice.subscription
            : invoice.subscription?.id;

        if (subscriptionId) {
            await prisma.userPlan.updateMany({
                where: { subscriptionId },
                data: { status: "past_due", isActive: false },
            });
            await recordWebhookEvent(eventId, eventType, subscriptionId);
        }
    }

    // --- CRITICAL ADDITION BELOW ---
    // This ensures every branch returns a response to Next.js
    return NextResponse.json({ received: true }, { status: 200 });
}