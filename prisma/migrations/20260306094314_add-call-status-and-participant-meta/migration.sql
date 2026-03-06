-- Rename existing enum used by call_participants to CallParticipantStatus
ALTER TYPE "CallStatus" RENAME TO "CallParticipantStatus";

-- Create new enum for Call.status
CREATE TYPE "CallStatus" AS ENUM ('RINGING', 'ONGOING', 'ENDED', 'MISSED', 'CANCELED');

-- AlterTable: call_participants
ALTER TABLE "call_participants" ADD COLUMN     "isMuted" BOOLEAN DEFAULT false,
ADD COLUMN     "isVideoEnabled" BOOLEAN DEFAULT true,
ADD COLUMN     "joinedAt" TIMESTAMP(3),
ADD COLUMN     "leftAt" TIMESTAMP(3);

-- Ensure status column uses the renamed enum
ALTER TABLE "call_participants" ALTER COLUMN "status" TYPE "CallParticipantStatus" USING ("status"::text::"CallParticipantStatus");

-- AlterTable: calls
ALTER TABLE "calls" ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "CallStatus" NOT NULL DEFAULT 'RINGING';

