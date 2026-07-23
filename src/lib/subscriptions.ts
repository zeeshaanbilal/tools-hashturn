import { prisma } from "@/lib/prisma";
import { cancelSubscription } from "@lemonsqueezy/lemonsqueezy.js";
import "@/lib/lemon";

export async function ensureSingleActiveSubscription(
  userId: string,
  excludeSubscriptionId?: string
) {
  await prisma.userPlan.updateMany({
    where: {
      userId,
      isActive: true,
      ...(excludeSubscriptionId && {
        OR: [
            { subscriptionId: { not: excludeSubscriptionId } },
            { subscriptionId: null },
          ],
      }),
    },
    data: {
      isActive: false,
      status: "cancelled",
      endDate: new Date(),
    },
  });
}

export async function cancelOldPaidSubscriptions(
  userId: string,
  newSubscriptionId: string
) {
  const oldActiveSubscriptions = await prisma.userPlan.findMany({
    where: {
      userId,
      isActive: true,
      AND: [
        {
          subscriptionId: {
            not: null,
          },
        },
        {
          subscriptionId: {
            not: newSubscriptionId,
          },
        },
      ],
    },
  });

  for (const oldSub of oldActiveSubscriptions) {
    if (oldSub.subscriptionId) {
      try {
        await cancelSubscription(oldSub.subscriptionId);
        console.log(
          `Cancelled old subscription: ${oldSub.subscriptionId}`
        );
      } catch (error) {
        console.error(
          `Failed to cancel subscription ${oldSub.subscriptionId}:`,
          error
        );
      }
    }
  }
}

export async function getActiveUserPlan(userId: string) {
  return await prisma.userPlan.findFirst({
    where: {
      userId,
      isActive: true,
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function activateFreePlan(userId: string) {
  const freePlan = await prisma.plan.findFirst({
    where: { name: { equals: "Free", mode: "insensitive" } },
  });

  if (!freePlan) {
    throw new Error("Free plan not found in database");
  }

  await ensureSingleActiveSubscription(userId);

  await prisma.userPlan.create({
    data: {
      userId,
      planId: freePlan.id,
      status: "active",
      isActive: true,
      startDate: new Date(),
    },
  });
}

export async function isWebhookEventProcessed(eventId: string): Promise<boolean> {
  const existing = await prisma.webhookEvent.findUnique({
    where: { eventId },
  });
  return !!existing;
}

export async function recordWebhookEvent(
  eventId: string,
  eventName: string,
  subscriptionId?: string
) {
  await prisma.webhookEvent.upsert({
    where: { eventId },
    update: {},
    create: {
      eventId,
      eventName,
      subscriptionId: subscriptionId || null,
    },
  });
}

