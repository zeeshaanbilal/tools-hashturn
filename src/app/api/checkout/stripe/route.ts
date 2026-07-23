import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planKey } = await req.json();

    if (planKey === "Free") {
        return NextResponse.json(
            { error: "Free plan does not require checkout" },
            { status: 400 }
        );
    }

    const plan = await prisma.plan.findFirst({
        where: { name: { equals: planKey, mode: "insensitive" } },
    });

    if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const priceId =
        planKey === "Premium"
            ? process.env.STRIPE_PREMIUM_PRICE_ID!
            : process.env.STRIPE_BUSINESS_PRICE_ID!;

    if (!priceId) {
        return NextResponse.json(
            { error: "Price ID not configured for this plan" },
            { status: 500 }
        );
    }

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
            metadata: {
                userId: session.user.id,
                planId: plan.id,
            },
            customer_email: session.user.email || undefined,
        });

        if (!checkoutSession.url) {
            return NextResponse.json(
                { error: "Failed to create checkout session" },
                { status: 500 }
            );
        }

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error: any) {
        console.error("Stripe Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}