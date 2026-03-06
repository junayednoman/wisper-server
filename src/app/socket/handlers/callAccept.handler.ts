import { CallParticipantStatus, CallStatus } from "@prisma/client";
import ApiError from "../../middlewares/classes/ApiError";
import prisma from "../../utils/prisma";
import { TAckFn, TSocket } from "../interface/socket.interface";
import ackHandler from "../utils/ackHandler";
import eventHandler from "../utils/eventHandler";
import onlineUsers from "../utils/onlineUsers";

type TCallAcceptPayload = {
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

export const callAccept = eventHandler<TCallAcceptPayload>(
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

    const now = new Date();

    await prisma.callParticipant.updateMany({
      where: {
        callId: call.id,
        authId,
      },
      data: {
        status: CallParticipantStatus.INCOMING,
        joinedAt: now,
        leftAt: null,
      },
    });

    const updatedCall = await prisma.call.update({
      where: {
        id: call.id,
      },
      data: {
        status: CallStatus.ONGOING,
        startedAt: call.startedAt ?? now,
      },
      select: {
        id: true,
        roomId: true,
        type: true,
        mode: true,
        status: true,
        startedAt: true,
      },
    });

    const participantIds = call.participants.map(
      participant => participant.authId
    );

    emitToParticipants(participantIds, "callAccepted", updatedCall);

    ackHandler(ack, {
      success: true,
      message: "Call accepted.",
    });
  }
);
