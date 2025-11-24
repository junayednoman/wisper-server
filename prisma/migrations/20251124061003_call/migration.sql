/*
  Warnings:

  - The values [ONGOING,ENDED,CANCELLED] on the enum `CallStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `endedAt` on the `calls` table. All the data in the column will be lost.
  - You are about to drop the column `initiatorId` on the `calls` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `calls` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `calls` table. All the data in the column will be lost.
  - You are about to drop the `call_participants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authId` to the `calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `calls` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CallRole" AS ENUM ('CALLER', 'RECEIVER');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."CallStatus_new" AS ENUM ('MISSED', 'OUTGOING', 'ONCOMING');
ALTER TABLE "public"."calls" ALTER COLUMN "status" TYPE "public"."CallStatus_new" USING ("status"::text::"public"."CallStatus_new");
ALTER TYPE "public"."CallStatus" RENAME TO "CallStatus_old";
ALTER TYPE "public"."CallStatus_new" RENAME TO "CallStatus";
DROP TYPE "public"."CallStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."call_participants" DROP CONSTRAINT "call_participants_callId_fkey";

-- DropForeignKey
ALTER TABLE "public"."call_participants" DROP CONSTRAINT "call_participants_participantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."calls" DROP CONSTRAINT "calls_initiatorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."calls" DROP CONSTRAINT "calls_receiverId_fkey";

-- AlterTable
ALTER TABLE "public"."calls" DROP COLUMN "endedAt",
DROP COLUMN "initiatorId",
DROP COLUMN "receiverId",
DROP COLUMN "startedAt",
ADD COLUMN     "authId" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "public"."CallRole" NOT NULL;

-- DropTable
DROP TABLE "public"."call_participants";

-- AddForeignKey
ALTER TABLE "public"."calls" ADD CONSTRAINT "calls_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
