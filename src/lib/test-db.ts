// lib/test-db.ts
import { prisma } from "./prisma";

export async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...");
    console.log("Database URL:", process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@')); // Hide password
    
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    
    // Test query
    const count = await prisma.tool.count();
    console.log(`✅ Found ${count} tools in database`);
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}