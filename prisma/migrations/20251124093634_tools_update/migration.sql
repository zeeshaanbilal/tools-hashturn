/*
  Warnings:

  - Added the required column `slug` to the `Tool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
