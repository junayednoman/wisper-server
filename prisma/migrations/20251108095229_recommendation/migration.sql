-- AlterTable
ALTER TABLE "public"."recommendations" ADD COLUMN     "authId" TEXT,
ADD COLUMN     "classId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."recommendations" ADD CONSTRAINT "recommendations_classReceiverId_fkey" FOREIGN KEY ("classReceiverId") REFERENCES "public"."classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommendations" ADD CONSTRAINT "recommendations_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."auths"("id") ON DELETE SET NULL ON UPDATE CASCADE;
