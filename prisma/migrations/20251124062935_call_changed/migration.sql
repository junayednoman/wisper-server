/*
  Warnings:

  - You are about to drop the column `authId` on the `calls` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `calls` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `calls` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."calls" DROP CONSTRAINT "calls_authId_fkey";

-- AlterTable
ALTER TABLE "public"."calls" DROP COLUMN "authId",
DROP COLUMN "role",
DROP COLUMN "status";

-- CreateTable
CREATE TABLE "public"."call_participants" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "role" "public"."CallRole" NOT NULL,
    "status" "public"."CallStatus" NOT NULL,

    CONSTRAINT "call_participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."call_participants" ADD CONSTRAINT "call_participants_callId_fkey" FOREIGN KEY ("callId") REFERENCES "public"."calls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."call_participants" ADD CONSTRAINT "call_participants_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
