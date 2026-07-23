import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const tools = await prisma.tool.findMany();
    console.log("Total tools in DB:", tools.length);
    if (tools.length > 0) {
      tools.forEach(t => console.log(t.name));
    }
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
