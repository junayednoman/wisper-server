/*
  Warnings:

  - A unique constraint covering the columns `[chatId]` on the table `chat_mutes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "chat_mutes_chatId_key" ON "public"."chat_mutes"("chatId");
