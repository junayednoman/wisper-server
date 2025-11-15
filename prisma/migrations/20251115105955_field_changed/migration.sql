/*
  Warnings:

  - You are about to drop the column `createdAt` on the `chat_deletions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."chat_deletions" DROP COLUMN "createdAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
