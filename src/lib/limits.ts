import { prisma } from "./prisma";

export async function checkToolUsageLimit(userId: string) {
  return true; // TEMPORARY BYPASS
}

export async function checkApiLimit(userId: string) {
  return true; // TEMPORARY BYPASS
}

export async function checkFileSizeLimit(userId: string, fileSizeBytes: number) {
  return true; // TEMPORARY BYPASS
}
