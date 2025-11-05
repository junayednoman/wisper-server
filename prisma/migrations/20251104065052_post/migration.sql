-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
