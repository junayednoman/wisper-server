-- AlterTable
ALTER TABLE "public"."boosts" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "public"."boosts" ADD CONSTRAINT "boosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."boosts" ADD CONSTRAINT "boosts_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."boost_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
