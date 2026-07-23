import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({ include: { plans: true } });
    console.log("Users:", users.map(u => ({
      id: u.id,
      email: u.email,
      plans: u.plans.map(p => ({ id: p.id, planId: p.planId, isActive: p.isActive }))
    })));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
