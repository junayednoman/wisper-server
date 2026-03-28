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
  uid?: number;
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
  const uid = hash.readUInt32BE(0) % 2147483647;
  return uid === 0 ? 1 : uid;
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

    const accepterName =
      accepter?.person?.name || accepter?.business?.name || "Participant";
    const accepterImage =
      accepter?.person?.image || accepter?.business?.image || "";

    const storedParticipant = await prisma.callParticipant.findFirst({
      where: {
        callId: call.id,
        authId,
      },
      select: {
        agoraUid: true,
      },
    });

    const accepterUid =
      data.uid ?? storedParticipant?.agoraUid ?? getNumericAgoraUid(authId);

    if (!storedParticipant?.agoraUid) {
      await prisma.callParticipant.updateMany({
        where: {
          callId: call.id,
          authId,
          agoraUid: null,
        },
        data: {
          agoraUid: accepterUid,
        },
      });
    }

    emitToParticipants(participantIds, "callParticipantJoined", {
      callId: call.id,
      userId: authId,
      uid: accepterUid,
      name: accepterName,
      image: accepterImage,
    });

    const acceptedParticipants = await prisma.callParticipant.findMany({
      where: {
        callId: call.id,
        joinedAt: {
          not: null,
        },
      },
      select: {
        authId: true,
        agoraUid: true,
        auth: {
          select: {
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
    });

    const accepted = acceptedParticipants.map(participant => {
      const name =
        participant.auth?.person?.name ||
        participant.auth?.business?.name ||
        "Participant";
      const image =
        participant.auth?.person?.image ||
        participant.auth?.business?.image ||
        "";
      const uid =
        participant.authId === authId
          ? accepterUid
          : (participant.agoraUid ?? getNumericAgoraUid(participant.authId));
      return {
        userId: participant.authId,
        uid,
        name,
        image,
      };
    });

    emitToParticipants(participantIds, "callParticipantsAccepted", {
      callId: call.id,
      participants: accepted,
    });

    ackHandler(ack, {
      success: true,
      message: "Call accepted.",
    });
  }
);
