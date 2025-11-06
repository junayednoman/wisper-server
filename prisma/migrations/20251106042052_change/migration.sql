/*
  Warnings:

  - You are about to drop the column `authId` on the `recommendations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[defaultResumeId]` on the table `persons` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."recommendations" DROP COLUMN "authId";

-- CreateIndex
CREATE UNIQUE INDEX "persons_defaultResumeId_key" ON "public"."persons"("defaultResumeId");
