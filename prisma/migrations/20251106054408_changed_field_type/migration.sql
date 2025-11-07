/*
  Warnings:

  - The `responsibilities` column on the `jobs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."jobs" DROP COLUMN "responsibilities",
ADD COLUMN     "responsibilities" TEXT[];
