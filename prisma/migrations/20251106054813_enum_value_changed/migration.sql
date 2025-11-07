/*
  Warnings:

  - The values [LINK] on the enum `JobApplicationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."JobApplicationType_new" AS ENUM ('EMAIL', 'EXTERNAL', 'CHAT');
ALTER TABLE "public"."jobs" ALTER COLUMN "applicationType" TYPE "public"."JobApplicationType_new" USING ("applicationType"::text::"public"."JobApplicationType_new");
ALTER TYPE "public"."JobApplicationType" RENAME TO "JobApplicationType_old";
ALTER TYPE "public"."JobApplicationType_new" RENAME TO "JobApplicationType";
DROP TYPE "public"."JobApplicationType_old";
COMMIT;
