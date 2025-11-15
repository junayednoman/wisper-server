/*
  Warnings:

  - You are about to drop the column `authId` on the `chats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."chats" DROP CONSTRAINT "chats_authId_fkey";

-- AlterTable
ALTER TABLE "public"."chats" DROP COLUMN "authId";
