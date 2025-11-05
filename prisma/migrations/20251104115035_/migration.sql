-- CreateEnum
CREATE TYPE "public"."PostStatus" AS ENUM ('ACTIVE', 'DELETED');

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "status" "public"."PostStatus" NOT NULL DEFAULT 'ACTIVE';
