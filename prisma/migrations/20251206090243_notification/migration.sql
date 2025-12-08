-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
