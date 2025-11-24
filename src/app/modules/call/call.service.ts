import { CallParticipant, CallRole, CallStatus, Prisma } from "@prisma/client";
import { TCall, TCallParticipant } from "./call.validation";
import prisma from "../../utils/prisma";
import ApiError from "../../middlewares/classes/ApiError";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";

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

export const callService = { createCall, getMyCalls };
