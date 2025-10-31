-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'SPEND');

-- CreateEnum
CREATE TYPE "public"."CallStatus" AS ENUM ('ONGOING', 'ENDED', 'MISSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."CallMode" AS ENUM ('ONE_TO_ONE', 'GROUP');

-- CreateEnum
CREATE TYPE "public"."CallType" AS ENUM ('VIDEO', 'AUDIO');

-- CreateEnum
CREATE TYPE "public"."ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "public"."BoostStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'PAUSED');

-- CreateEnum
CREATE TYPE "public"."BoostPackageStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."ComplaintStatus" AS ENUM ('PENDING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "public"."ComplaintType" AS ENUM ('ACCOUNT', 'POST');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO');

-- CreateEnum
CREATE TYPE "public"."FileType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOC');

-- CreateEnum
CREATE TYPE "public"."MuteUntil" AS ENUM ('EIGHT_HOURS', 'ONE_WEEK', 'ALWAYS');

-- CreateEnum
CREATE TYPE "public"."ChatRole" AS ENUM ('MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."ChatType" AS ENUM ('GROUP', 'CLASS', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "public"."JobApplicationType" AS ENUM ('EMAIL', 'LINK', 'CHAT');

-- CreateEnum
CREATE TYPE "public"."JobQualification" AS ENUM ('BSC', 'PHD', 'NHD', 'OND');

-- CreateEnum
CREATE TYPE "public"."JobLocation" AS ENUM ('ON_SITE', 'REMOTE', 'HYBRID');

-- CreateEnum
CREATE TYPE "public"."JobCompensationType" AS ENUM ('MONTHLY', 'ONE_OFF');

-- CreateEnum
CREATE TYPE "public"."JobExperienceLevel" AS ENUM ('ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR');

-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('PART_TIME', 'FULL_TIME', 'CONTRACT');

-- CreateEnum
CREATE TYPE "public"."CommentAccess" AS ENUM ('FOLLOWERS', 'EVERYONE');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'PERSONAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."LoginProvider" AS ENUM ('FACEBOOK', 'GOOGLE', 'EMAIL');

-- CreateTable
CREATE TABLE "public"."auths" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "needsPasswordChange" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."UserRole" NOT NULL,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'PENDING',
    "loginProvider" "public"."LoginProvider" NOT NULL DEFAULT 'EMAIL',
    "fcmToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."otps" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."persons" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "industry" TEXT NOT NULL,
    "image" TEXT,
    "title" TEXT,
    "defaultResumeId" TEXT,
    "address" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."businesses" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "industry" TEXT NOT NULL,
    "image" TEXT,
    "address" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "images" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "isSponsored" BOOLEAN NOT NULL DEFAULT false,
    "commentAccess" "public"."CommentAccess" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resumes" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "fileSize" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jobs" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "public"."JobType" NOT NULL,
    "experienceLevel" "public"."JobExperienceLevel" NOT NULL,
    "compensationType" "public"."JobCompensationType" NOT NULL,
    "company" DOUBLE PRECISION NOT NULL,
    "location" "public"."JobLocation" NOT NULL,
    "industry" TEXT NOT NULL,
    "qualification" "public"."JobQualification" NOT NULL,
    "requirements" TEXT[],
    "responsibilities" TEXT NOT NULL,
    "applicationType" "public"."JobApplicationType" NOT NULL,
    "applicationLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "allowInvitation" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "allowInvitation" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chats" (
    "id" TEXT NOT NULL,
    "lastMessageId" TEXT,
    "type" "public"."ChatType" NOT NULL,
    "groupId" TEXT,
    "classId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authId" TEXT,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_deletions" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_deletions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_participants" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "role" "public"."ChatRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blocked_chat_participants" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "authId" TEXT NOT NULL,

    CONSTRAINT "blocked_chat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_mutes" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "muteUntil" "public"."MuteUntil" NOT NULL,
    "mutedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_mutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "file" TEXT,
    "fileType" "public"."FileType" DEFAULT 'IMAGE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."message_seen" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_seen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."docs" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."links" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medias" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "fileType" "public"."MediaType" NOT NULL DEFAULT 'IMAGE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recommendations" (
    "id" TEXT NOT NULL,
    "giverId" TEXT NOT NULL,
    "receiverId" TEXT,
    "classReceiverId" TEXT,
    "text" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authId" TEXT,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."complaints" (
    "id" TEXT NOT NULL,
    "complainantId" TEXT NOT NULL,
    "postId" TEXT,
    "accountId" TEXT,
    "type" "public"."ComplaintType" NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "public"."ComplaintStatus" NOT NULL DEFAULT 'PENDING',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authId" TEXT,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."boost_packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "status" "public"."BoostPackageStatus" NOT NULL,

    CONSTRAINT "boost_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."boosts" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "targetIndustry" TEXT NOT NULL,
    "impressions" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL,
    "status" "public"."BoostStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."connections" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "public"."ConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."calls" (
    "id" TEXT NOT NULL,
    "type" "public"."CallType" NOT NULL,
    "mode" "public"."CallMode" NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "participantIds" TEXT[],
    "roomId" TEXT NOT NULL,
    "status" "public"."CallStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER NOT NULL,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CallParticipant" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "CallParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wallets" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "hasSeen" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."legals" (
    "id" TEXT NOT NULL,
    "privacyPolicy" TEXT NOT NULL,
    "termsAndConditions" TEXT NOT NULL,
    "aboutUs" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auths_email_key" ON "public"."auths"("email");

-- CreateIndex
CREATE UNIQUE INDEX "otps_email_key" ON "public"."otps"("email");

-- CreateIndex
CREATE UNIQUE INDEX "persons_email_key" ON "public"."persons"("email");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_email_key" ON "public"."businesses"("email");

-- CreateIndex
CREATE UNIQUE INDEX "chats_groupId_key" ON "public"."chats"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "chats_classId_key" ON "public"."chats"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_authId_key" ON "public"."wallets"("authId");

-- AddForeignKey
ALTER TABLE "public"."otps" ADD CONSTRAINT "otps_email_fkey" FOREIGN KEY ("email") REFERENCES "public"."auths"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."persons" ADD CONSTRAINT "persons_email_fkey" FOREIGN KEY ("email") REFERENCES "public"."auths"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."persons" ADD CONSTRAINT "persons_defaultResumeId_fkey" FOREIGN KEY ("defaultResumeId") REFERENCES "public"."resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."businesses" ADD CONSTRAINT "businesses_email_fkey" FOREIGN KEY ("email") REFERENCES "public"."auths"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resumes" ADD CONSTRAINT "resumes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jobs" ADD CONSTRAINT "jobs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chats" ADD CONSTRAINT "chats_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chats" ADD CONSTRAINT "chats_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chats" ADD CONSTRAINT "chats_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."auths"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_deletions" ADD CONSTRAINT "chat_deletions_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_deletions" ADD CONSTRAINT "chat_deletions_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_participants" ADD CONSTRAINT "chat_participants_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_participants" ADD CONSTRAINT "chat_participants_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blocked_chat_participants" ADD CONSTRAINT "blocked_chat_participants_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blocked_chat_participants" ADD CONSTRAINT "blocked_chat_participants_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_mutes" ADD CONSTRAINT "chat_mutes_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_mutes" ADD CONSTRAINT "chat_mutes_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message_seen" ADD CONSTRAINT "message_seen_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message_seen" ADD CONSTRAINT "message_seen_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."chat_participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."docs" ADD CONSTRAINT "docs_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."docs" ADD CONSTRAINT "docs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."links" ADD CONSTRAINT "links_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."links" ADD CONSTRAINT "links_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medias" ADD CONSTRAINT "medias_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medias" ADD CONSTRAINT "medias_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommendations" ADD CONSTRAINT "recommendations_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommendations" ADD CONSTRAINT "recommendations_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."auths"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."complaints" ADD CONSTRAINT "complaints_complainantId_fkey" FOREIGN KEY ("complainantId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."complaints" ADD CONSTRAINT "complaints_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."complaints" ADD CONSTRAINT "complaints_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."auths"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."connections" ADD CONSTRAINT "connections_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."connections" ADD CONSTRAINT "connections_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."calls" ADD CONSTRAINT "calls_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."calls" ADD CONSTRAINT "calls_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CallParticipant" ADD CONSTRAINT "CallParticipant_callId_fkey" FOREIGN KEY ("callId") REFERENCES "public"."calls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CallParticipant" ADD CONSTRAINT "CallParticipant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallets" ADD CONSTRAINT "wallets_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."auths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "public"."wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
