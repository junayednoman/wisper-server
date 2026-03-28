import { CallParticipantStatus, CallStatus } from "@prisma/client";
import { createHash } from "crypto";
import ApiError from "../../../middlewares/classes/ApiError";
import prisma from "../../../utils/prisma";
import { TAckFn, TSocket } from "../../interface/socket.interface";
import ackHandler from "../../utils/ackHandler";
import eventHandler from "../../utils/eventHandler";
import onlineUsers from "../../utils/onlineUsers";

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

const getNumericAgoraUid = (userId: string) => {
  const hash = createHash("sha256").update(userId).digest();
  const uid = hash.readUInt32BE(0);
  return uid === 0 ? 1 : uid;
};

export const callAccept = eventHandler<TCallAcceptPayload>(
  async (socket: TSocket, data, ack: TAckFn) => {
    console.log("hitting 1");
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
    console.log("hitting 2");
    const isParticipant = call.participants.some(
      participant => participant.authId === authId
    );

    if (!isParticipant) {
      throw new ApiError(403, "You are not a participant of this call.");
    }
    console.log("hitting 3");
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
    console.log("hitting 4");
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
    console.log("hitting 5");
    const participantIds = call.participants.map(
      participant => participant.authId
    );
    console.log("hitting 6");
    emitToParticipants(participantIds, "callAccepted", updatedCall);
    console.log("hitting 7");
    const accepter = await prisma.auth.findUnique({
      where: {
        id: authId,
      },
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
    });
    console.log("hitting 8");
    const accepterName =
      accepter?.person?.name || accepter?.business?.name || "Participant";
    const accepterImage =
      accepter?.person?.image || accepter?.business?.image || "";
    console.log("hitting 9");
    emitToParticipants(participantIds, "callParticipantJoined", {
      callId: call.id,
      userId: authId,
      uid: getNumericAgoraUid(authId),
      name: accepterName,
      image: accepterImage,
    });
    console.log("hitting 10");
    ackHandler(ack, {
      success: true,
      message: "Call accepted.",
    });
  }
);
