/*
  Warnings:

  - Added the required column `salary` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."jobs" ADD COLUMN     "salary" DOUBLE PRECISION NOT NULL;
