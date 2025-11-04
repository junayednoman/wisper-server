/*
  Warnings:

  - You are about to drop the column `date` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the `CallParticipant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CallParticipant" DROP CONSTRAINT "CallParticipant_callId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CallParticipant" DROP CONSTRAINT "CallParticipant_participantId_fkey";

-- AlterTable
ALTER TABLE "public"."wallets" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."CallParticipant";

-- CreateTable
CREATE TABLE "public"."call_participants" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."call_participants" ADD CONSTRAINT "call_participants_callId_fkey" FOREIGN KEY ("callId") REFERENCES "public"."calls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."call_participants" ADD CONSTRAINT "call_participants_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
