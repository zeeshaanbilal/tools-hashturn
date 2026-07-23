import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ planName: "Free" }); // fallback
  }

  const userPlan = await prisma.userPlan.findFirst({
    where: { userId: session.user.id, isActive: true },
    include: { plan: true },
  });

  if (!userPlan) {
    return NextResponse.json({ planName: "Free" });
  }

  return NextResponse.json({
    planName: userPlan.plan.name,
  });
}
