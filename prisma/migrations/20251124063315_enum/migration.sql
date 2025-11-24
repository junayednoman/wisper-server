/*
  Warnings:

  - The values [ONCOMING] on the enum `CallStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CallStatus_new" AS ENUM ('MISSED', 'OUTGOING', 'INCOMING');
ALTER TABLE "public"."call_participants" ALTER COLUMN "status" TYPE "public"."CallStatus_new" USING ("status"::text::"public"."CallStatus_new");
ALTER TYPE "public"."CallStatus" RENAME TO "CallStatus_old";
ALTER TYPE "public"."CallStatus_new" RENAME TO "CallStatus";
DROP TYPE "public"."CallStatus_old";
COMMIT;
