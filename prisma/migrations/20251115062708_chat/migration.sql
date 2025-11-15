/*
  Warnings:

  - You are about to drop the column `lastMessageId` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."chats" DROP COLUMN "lastMessageId";
