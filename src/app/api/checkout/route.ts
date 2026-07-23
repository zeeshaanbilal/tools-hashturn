import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import "@/lib/lemon";
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

  const variantId =
    planKey === "Premium"
      ? process.env.LEMON_PREMIUM_VARIANT_ID!
      : process.env.LEMON_BUSINESS_VARIANT_ID!;

  if (!variantId) {
    return NextResponse.json(
      { error: "Variant ID not configured for this plan" },
      { status: 500 }
    );
  }

  const checkout = await createCheckout(
    process.env.LEMON_STORE_ID!,
    variantId,
    {
      checkoutData: {
        custom: {
          userId: session.user.id,
          planId: plan.id,
        },
      },
      productOptions: {
        enabledVariants: [parseInt(variantId)],
        redirectUrl: `${
            process.env.NEXT_PUBLIC_APP_URL ||
            "http://localhost:3000"
        }/dashboard`,
        receiptButtonText: "Go to Dashboard",
        receiptThankYouNote: "Thank you for subscribing"
      }
    }
  );

  if (!checkout.data) {
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    url: checkout.data.data.attributes.url,
  });
}
