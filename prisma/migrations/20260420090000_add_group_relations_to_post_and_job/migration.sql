ALTER TABLE "public"."posts"
ADD COLUMN "groupId" TEXT;

ALTER TABLE "public"."jobs"
ADD COLUMN "groupId" TEXT;

ALTER TABLE "public"."posts"
ADD CONSTRAINT "posts_groupId_fkey"
FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "public"."jobs"
ADD CONSTRAINT "jobs_groupId_fkey"
FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
