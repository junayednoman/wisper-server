import { CallParticipantStatus, CallRole, CallStatus } from "@prisma/client";
import ApiError from "../../middlewares/classes/ApiError";
import prisma from "../../utils/prisma";
import { TAckFn, TSocket } from "../interface/socket.interface";
import ackHandler from "../utils/ackHandler";
import eventHandler from "../utils/eventHandler";
import onlineUsers from "../utils/onlineUsers";

type TCallInvitePayload = {
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

export const callInvite = eventHandler<TCallInvitePayload>(
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

    const caller = call.participants.find(
      participant => participant.authId === authId
    );

    if (!caller || caller.role !== CallRole.CALLER) {
      throw new ApiError(403, "Only the caller can invite participants.");
    }

    if (call.status !== CallStatus.RINGING) {
      await prisma.call.update({
        where: {
          id: call.id,
        },
        data: {
          status: CallStatus.RINGING,
        },
      });
    }

    await prisma.callParticipant.updateMany({
      where: {
        callId: call.id,
        role: CallRole.RECEIVER,
      },
      data: {
        status: CallParticipantStatus.INCOMING,
      },
    });

    const participantIds = call.participants
      .filter(participant => participant.role === CallRole.RECEIVER)
      .map(participant => participant.authId);

    emitToParticipants(participantIds, "callIncoming", {
      callId: call.id,
      roomId: call.roomId,
      type: call.type,
      mode: call.mode,
      status: CallStatus.RINGING,
    });

    ackHandler(ack, {
      success: true,
      message: "Call invitation sent.",
    });
  }
);
