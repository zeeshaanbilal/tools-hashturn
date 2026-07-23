import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelSubscription } from "@lemonsqueezy/lemonsqueezy.js";
import "@/lib/lemon";


export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const activePaid = await prisma.userPlan.findFirst({
    where: {
      userId,
      isActive: true,
      subscriptionId: { not: null },
    },
  });

  if (activePaid?.subscriptionId) {
    try {
      await cancelSubscription(activePaid.subscriptionId);
      console.log("✅ Cancelled Lemon subscription:", activePaid.subscriptionId);
    } catch (error) {
      console.error("❌ Failed to cancel subscription:", error);
      return NextResponse.json(
        { error: "Failed to cancel subscription" },
        { status: 500 }
      );
    }
  }

  await prisma.userPlan.updateMany({
    where: { userId },
    data: {
      isActive: false,
      status: "cancelled",
      endDate: new Date(),
    },
  });

  const freePlan = await prisma.plan.findFirst({
    where: { name: { equals: "Free", mode: "insensitive" } },
  });

  if (!freePlan) {
    return NextResponse.json(
      { error: "Free plan not found" },
      { status: 500 }
    );
  }

  await prisma.userPlan.create({
    data: {
      userId,
      planId: freePlan.id,
      status: "active",
      isActive: true,
      startDate: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
