/*
  Warnings:

  - You are about to drop the `docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `links` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."docs" DROP CONSTRAINT "docs_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."docs" DROP CONSTRAINT "docs_chatId_fkey";

-- DropForeignKey
ALTER TABLE "public"."links" DROP CONSTRAINT "links_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."links" DROP CONSTRAINT "links_chatId_fkey";

-- DropForeignKey
ALTER TABLE "public"."medias" DROP CONSTRAINT "medias_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."medias" DROP CONSTRAINT "medias_chatId_fkey";

-- AlterTable
ALTER TABLE "public"."messages" ADD COLUMN     "link" TEXT,
ALTER COLUMN "text" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."docs";

-- DropTable
DROP TABLE "public"."links";

-- DropTable
DROP TABLE "public"."medias";

-- DropEnum
DROP TYPE "public"."MediaType";
