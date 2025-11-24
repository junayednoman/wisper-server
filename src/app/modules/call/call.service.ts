import { CallParticipant, CallRole, CallStatus } from "@prisma/client";
import { TCall, TCallParticipant } from "./call.validation";
import prisma from "../../utils/prisma";
import ApiError from "../../middlewares/classes/ApiError";

const createCall = async (userId: string, payload: TCall) => {
  for (const participant of payload.participants) {
    const user = await prisma.auth.findUnique({
      where: {
        id: participant.id,
      },
    });

    if (!user) throw new ApiError(400, `Invalid user id: ${participant.id}`);
  }
  const { participants, ...callData } = payload;
  const result = await prisma.$transaction(async tn => {
    const newCall = await tn.call.create({
      data: callData,
    });

    const participantPayloads: Pick<
      CallParticipant,
      "callId" | "authId" | "role" | "status"
    >[] = participants.map((p: TCallParticipant) => ({
      callId: newCall.id,
      authId: p.id,
      role: CallRole.RECEIVER,
      status: p.status,
    }));

    participantPayloads.push({
      callId: newCall.id,
      authId: userId,
      role: CallRole.CALLER,
      status: CallStatus.OUTGOING,
    });

    await tn.callParticipant.createMany({ data: participantPayloads });

    return newCall;
  });
  return result;
};

export const callService = { createCall };
