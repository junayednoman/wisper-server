/*
  Warnings:

  - You are about to drop the column `authId` on the `complaints` table. All the data in the column will be lost.
  - Changed the type of `role` on the `call_participants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."CallRole" AS ENUM ('CALLER', 'RECEIVER');

-- AlterTable
ALTER TABLE "public"."call_participants" DROP COLUMN "role",
ADD COLUMN     "role" "public"."CallRole" NOT NULL;

-- AlterTable
ALTER TABLE "public"."complaints" DROP COLUMN "authId";

-- AlterTable
ALTER TABLE "public"."legals" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "public"."CallParticipantRole";

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
