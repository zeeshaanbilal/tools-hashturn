/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionId]` on the table `UserPlan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `UserPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `UserPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserPlan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "UserPlan_subscriptionId_key" ON "UserPlan"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPlan_orderId_key" ON "UserPlan"("orderId");

-- CreateIndex
CREATE INDEX "UserPlan_userId_isActive_idx" ON "UserPlan"("userId", "isActive");
