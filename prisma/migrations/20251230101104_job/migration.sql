/*
  Warnings:

  - The `location` column on the `jobs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."JobLocationType" AS ENUM ('ON_SITE', 'REMOTE', 'HYBRID');

-- AlterTable
ALTER TABLE "public"."jobs" ADD COLUMN     "locationType" "public"."JobLocationType" NOT NULL DEFAULT 'ON_SITE',
DROP COLUMN "location",
ADD COLUMN     "location" TEXT;

-- DropEnum
DROP TYPE "public"."JobLocation";
