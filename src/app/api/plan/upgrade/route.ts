import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planKey } = await req.json();

    // Find plan by name
    const plan = await prisma.plan.findFirst({
      where: { name: { equals: planKey, mode: "insensitive" } },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const durationDays = plan.durationDays ?? 30;
    const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    // Deactivate old plan
    await prisma.userPlan.updateMany({
      where: { userId: session.user.id, isActive: true },
      data: { isActive: false, endDate: new Date() },
    });

    // Assign new plan
    await prisma.userPlan.create({
      data: {
        userId: session.user.id,
        planId: plan.id,
        startDate: new Date(),
        endDate: endDate,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
