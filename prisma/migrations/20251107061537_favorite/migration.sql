-- CreateTable
CREATE TABLE "public"."favorite_jobs" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "authId" TEXT NOT NULL,

    CONSTRAINT "favorite_jobs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."favorite_jobs" ADD CONSTRAINT "favorite_jobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorite_jobs" ADD CONSTRAINT "favorite_jobs_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
