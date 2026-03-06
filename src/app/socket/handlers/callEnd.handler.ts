import { CallStatus } from "@prisma/client";
import ApiError from "../../middlewares/classes/ApiError";
import prisma from "../../utils/prisma";
import { TAckFn, TSocket } from "../interface/socket.interface";
import ackHandler from "../utils/ackHandler";
import eventHandler from "../utils/eventHandler";
import onlineUsers from "../utils/onlineUsers";

type TCallEndPayload = {
  callId: string;
};

const emitToParticipants = (
  participantIds: string[],
  event: string,
  payload: unknown
) => {
  participantIds.forEach(participantId => {
    const participantSocket = onlineUsers[participantId];
    if (participantSocket) {
      participantSocket.emit(event, payload);
    }
  });
};

export const callEnd = eventHandler<TCallEndPayload>(
  async (socket: TSocket, data, ack: TAckFn) => {
    const authId = socket.auth.id;

    const call = await prisma.call.findUnique({
      where: {
        id: data.callId,
      },
      include: {
        participants: {
          select: {
            authId: true,
          },
        },
      },
    });

    if (!call) throw new ApiError(404, "Call not found.");

    const isParticipant = call.participants.some(
      participant => participant.authId === authId
    );

    if (!isParticipant) {
      throw new ApiError(403, "You are not a participant of this call.");
    }

    if (call.status === CallStatus.ENDED) {
      ackHandler(ack, {
        success: true,
        message: "Call already ended.",
      });
      return;
    }

    const endedAt = new Date();
    const startedAt = call.startedAt ?? call.date;
    const durationSeconds = Math.max(
      0,
      Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000)
    );

    const updatedCall = await prisma.call.update({
      where: {
        id: call.id,
      },
      data: {
        status: CallStatus.ENDED,
        endedAt,
        duration: durationSeconds,
      },
    });

    await prisma.callParticipant.updateMany({
      where: {
        callId: call.id,
        leftAt: null,
      },
      data: {
        leftAt: endedAt,
      },
    });

    const participantIds = call.participants.map(
      participant => participant.authId
    );

    emitToParticipants(participantIds, "callEnded", {
      callId: updatedCall.id,
      status: updatedCall.status,
      endedAt: updatedCall.endedAt,
      duration: updatedCall.duration,
    });

    ackHandler(ack, {
      success: true,
      message: "Call ended.",
    });
  }
);
