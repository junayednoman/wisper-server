/*
  Warnings:

  - You are about to drop the column `muteUntil` on the `chat_mutes` table. All the data in the column will be lost.
  - Added the required column `muteFor` to the `chat_mutes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."MuteFor" AS ENUM ('EIGHT_HOURS', 'ONE_WEEK', 'ALWAYS');

-- AlterTable
ALTER TABLE "public"."chat_mutes" DROP COLUMN "muteUntil",
ADD COLUMN     "muteFor" "public"."MuteFor" NOT NULL;

-- DropEnum
DROP TYPE "public"."MuteUntil";
