import {
  CallParticipant,
  CallParticipantStatus,
  CallRole,
  CallStatus,
  Prisma,
} from "@prisma/client";
import { RtcRole, RtcTokenBuilder } from "agora-access-token";
import { TCall, TCallParticipant, TCallTokenPayload } from "./call.validation";
import prisma from "../../utils/prisma";
import ApiError from "../../middlewares/classes/ApiError";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";
import config from "../../config";
import { randomUUID } from "crypto";
import getNumericAgoraUid from "../../utils/getNumericAgoraUid";

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
  const roomId = `call_${randomUUID()}`;

  const result = await prisma.$transaction(async tn => {
    const newCall = await tn.call.create({
      data: {
        ...callData,
        roomId,
        duration: 0,
      },
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
      status: CallParticipantStatus.OUTGOING,
    });

    await tn.callParticipant.createMany({ data: participantPayloads });

    return newCall;
  });

  return result;
};

const getMyCalls = async (
  userId: string,
  options: TPaginationOptions,
  query: Record<string, unknown>
) => {
  const { status } = query;
  const andConditions: Prisma.CallWhereInput[] = [];

  if (status) {
    andConditions.push({
      participants: {
        some: {
          status: status,
        },
      },
    });
  }

  andConditions.push({
    participants: {
      some: {
        authId: userId,
      },
    },
  });

  const whereConditions: Prisma.CallWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const { page, take, skip } = calculatePagination(options);
  const calls = await prisma.call.findMany({
    where: whereConditions,
    select: {
      id: true,
      type: true,
      duration: true,
      mode: true,
      date: true,
      participants: {
        where: {
          OR: [{ role: CallRole.CALLER }, { authId: userId }],
        },
        select: {
          status: true,
          auth: {
            select: {
              id: true,
              person: {
                select: {
                  name: true,
                  image: true,
                },
              },
              business: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
    skip,
    take,
    orderBy: { date: "desc" },
  });

  const total = await prisma.call.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit: take,
    total,
  };
  return { meta, calls };
};

const endCall = async (userId: string, callId: string) => {
  const call = await prisma.call.findUnique({
    where: {
      id: callId,
    },
    include: {
      participants: {
        where: {
          authId: userId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!call || !call.participants.length) {
    throw new ApiError(403, "You are not a participant of this call.");
  }

  if (call.status === CallStatus.ENDED || call.status === CallStatus.CANCELED) {
    return call;
  }

  const endedAt = new Date();
  const startedAt = call.startedAt ?? call.date;
  const durationSeconds = Math.max(
    0,
    Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000)
  );

  const result = await prisma.call.update({
    where: {
      id: callId,
    },
    data: {
      status: CallStatus.ENDED,
      endedAt,
      duration: durationSeconds,
    },
  });

  await prisma.callParticipant.updateMany({
    where: {
      callId,
      leftAt: null,
    },
    data: {
      leftAt: endedAt,
    },
  });

  return result;
};

const generateCallToken = async (
  userId: string,
  payload: TCallTokenPayload
) => {
  const appId = config.agora.appId;
  const appCertificate = config.agora.appCertificate;

  if (!appId || !appCertificate) {
    throw new ApiError(500, "Agora credentials are not configured.");
  }

  const call = await prisma.call.findUnique({
    where: {
      id: payload.callId,
    },
    select: {
      id: true,
      roomId: true,
      status: true,
      participants: {
        where: {
          authId: userId,
        },
        select: {
          id: true,
          agoraUid: true,
        },
      },
    },
  });

  if (!call || !call.participants.length) {
    throw new ApiError(403, "You are not a participant of this call.");
  }

  if (call.roomId !== payload.roomId) {
    throw new ApiError(400, "Room id does not match the call.");
  }

  if (call.status === CallStatus.ENDED || call.status === CallStatus.CANCELED) {
    throw new ApiError(400, "Call has already ended.");
  }

  const expireSeconds = Number(config.agora.tokenExpireSeconds ?? "3600");
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expireSeconds;

  const role = RtcRole.PUBLISHER;

  const existingParticipant = call.participants[0];
  const uid = existingParticipant?.agoraUid ?? getNumericAgoraUid(userId);

  if (!existingParticipant?.agoraUid) {
    await prisma.callParticipant.updateMany({
      where: {
        callId: call.id,
        authId: userId,
        agoraUid: null,
      },
      data: {
        agoraUid: uid,
      },
    });
  }

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    payload.roomId,
    uid,
    role,
    privilegeExpiredTs
  );

  return {
    token,
    uid,
    expiresAt: new Date(privilegeExpiredTs * 1000).toISOString(),
    expiresIn: expireSeconds,
  };
};

export const callService = {
  createCall,
  getMyCalls,
  generateCallToken,
  endCall,
};
