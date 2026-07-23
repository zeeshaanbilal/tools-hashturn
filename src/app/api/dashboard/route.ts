import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveUserPlan } from "@/lib/subscriptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const documentsProcessed = await prisma.processedFile.count({
      where: {
        userId,
        createdAt: { gte: firstDay },
      },
    });

    const toolsUsedResult = await prisma.processedFile.groupBy({
      by: ["toolId"],
      where: {
        userId,
        toolId: { not: null },
      },
    });
    const toolsUsed = toolsUsedResult.length;

    const storageResult = await prisma.processedFile.aggregate({
      _sum: { fileSize: true },
      where: { userId },
    });
    const storageUsed = storageResult._sum.fileSize || 0;

    const recentActivityRaw = await prisma.processedFile.findMany({
      where: { userId },
      include: {
        tool: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const recentActivity = recentActivityRaw.map((item: any) => ({
      id: item.id,
      fileName: item.fileName,
      fileType: item.fileType,
      tool: item.tool?.name || "Unknown",
      date: item.createdAt.toISOString(),
      status: item.status,
    }));

    const activePlan = await getActiveUserPlan(userId);
    const subscriptionPlan = activePlan?.plan?.name || "Free";

    return NextResponse.json({
      documentsProcessed,
      toolsUsed,
      storageUsed,
      recentActivity,
      subscriptionPlan,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

