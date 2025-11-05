/*
  Warnings:

  - You are about to drop the column `participantIds` on the `calls` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."auths" ADD COLUMN     "allowNotifications" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."calls" DROP COLUMN "participantIds";
