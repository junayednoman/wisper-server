import { CallParticipantStatus, CallRole, CallStatus } from "@prisma/client";
import ApiError from "../../middlewares/classes/ApiError";
import prisma from "../../utils/prisma";
import { TAckFn, TSocket } from "../interface/socket.interface";
import ackHandler from "../utils/ackHandler";
import eventHandler from "../utils/eventHandler";
import onlineUsers from "../utils/onlineUsers";

type TCallDeclinePayload = {
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

export const callDecline = eventHandler<TCallDeclinePayload>(
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
            role: true,
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
        status: CallParticipantStatus.MISSED,
        leftAt: now,
      },
    });

    const callers = call.participants.filter(
      participant => participant.role === CallRole.CALLER
    );

    const callerIds = callers.map(participant => participant.authId);

    const remainingReceivers = await prisma.callParticipant.count({
      where: {
        callId: call.id,
        role: CallRole.RECEIVER,
        status: {
          not: CallParticipantStatus.MISSED,
        },
      },
    });

    let updatedStatus = call.status;

    if (remainingReceivers === 0) {
      const updatedCall = await prisma.call.update({
        where: {
          id: call.id,
        },
        data: {
          status: CallStatus.MISSED,
          endedAt: now,
          duration: 0,
        },
        select: {
          status: true,
        },
      });
      updatedStatus = updatedCall.status;
    }

    emitToParticipants(callerIds, "callDeclined", {
      callId: call.id,
      status: updatedStatus,
    });

    ackHandler(ack, {
      success: true,
      message: "Call declined.",
    });
  }
);
