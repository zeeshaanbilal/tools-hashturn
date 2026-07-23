/*
  Warnings:

  - Made the column `storagePath` on table `ProcessedFile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."ProcessedFile" DROP CONSTRAINT "ProcessedFile_userId_fkey";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "maxApiCallsPerMonth" INTEGER,
ADD COLUMN     "maxFileSizeMB" INTEGER;

-- AlterTable
ALTER TABLE "ProcessedFile" ALTER COLUMN "storagePath" SET NOT NULL;

-- CreateTable
CREATE TABLE "ApiCall" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "calledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiCall_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProcessedFile" ADD CONSTRAINT "ProcessedFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiCall" ADD CONSTRAINT "ApiCall_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
