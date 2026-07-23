process.env.DATABASE_URL = "postgresql://neondb_owner:npg_KvXari0YZ3wt@ep-bitter-recipe-avzx1h4r-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const tools = await prisma.tool.findMany();
    console.log("Tools:", tools.map(t => t.slug));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
