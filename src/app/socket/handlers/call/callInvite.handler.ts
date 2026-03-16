import { CallParticipantStatus, CallRole, CallStatus } from "@prisma/client";
import { RtcRole, RtcTokenBuilder } from "agora-access-token";
import { createHash } from "crypto";
import ApiError from "../../../middlewares/classes/ApiError";
import prisma from "../../../utils/prisma";
import config from "../../../config";
import { sendDataMessageToToken } from "../../../utils/sendNotification";
import { TAckFn, TSocket } from "../../interface/socket.interface";
import ackHandler from "../../utils/ackHandler";
import eventHandler from "../../utils/eventHandler";
import onlineUsers from "../../utils/onlineUsers";

type TCallInvitePayload = {
  callId: string;
  token: string;
  groupId: string;
  groupName: string | null;
  groupImage: string | null;
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

const buildAgoraToken = (userId: string, roomId: string) => {
  const appId = config.agora.appId;
  const appCertificate = config.agora.appCertificate;

  if (!appId || !appCertificate) {
    throw new ApiError(500, "Agora credentials are not configured.");
  }

  const expireSeconds = Number(config.agora.tokenExpireSeconds ?? "3600");
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expireSeconds;
  const role = RtcRole.PUBLISHER;
  const uid = getNumericAgoraUid(userId);

  return RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    roomId,
    uid,
    role,
    privilegeExpiredTs
  );
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
            auth: {
              select: {
                fcmToken: true,
                deviceType: true,
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

    const callerName =
      caller?.auth?.person?.name || caller?.auth?.business?.name || "Caller";
    const callerImage =
      caller?.auth?.person?.image || caller?.auth?.business?.image || "";

    const group = await prisma.group.findUnique({
      where: {
        id: data.groupId,
      },
      include: {
        chat: {
          include: {
            participants: {
              select: {
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
            },
          },
        },
      },
    });

    const participants =
      group?.chat?.participants
        ?.map(participant => {
          const name =
            participant.auth?.person?.name || participant.auth?.business?.name;
          const image =
            participant.auth?.person?.image ||
            participant.auth?.business?.image ||
            "";

          if (!name) return null;

          return { name, image };
        })
        .filter((participant): participant is { name: string; image: string } =>
          Boolean(participant)
        ) ?? [];

    emitToParticipants(participantIds, "callIncoming", {
      callId: call.id,
      roomId: call.roomId,
      type: call.type,
      mode: call.mode,
      status: CallStatus.RINGING,
      token: data.token,
      callerName,
      callerImage,
      groupName: data.groupName,
      groupImage: data.groupImage,
      participants,
    });

    await Promise.all(
      call.participants
        .filter(participant => participant.role === CallRole.RECEIVER)
        .map(participant => {
          const receiverToken = participant.auth?.fcmToken;
          const deviceType = participant.auth?.deviceType;
          if (!receiverToken || deviceType === "ios") return null;

          const agoraToken = buildAgoraToken(participant.authId, call.roomId);

          return sendDataMessageToToken(receiverToken, {
            type: "incoming_call",
            call_id: call.id,
            caller_name: callerName,
            caller_image: callerImage,
            call_type: call.type,
            channel_name: call.roomId,
            agora_token: agoraToken,
          });
        })
    );

    ackHandler(ack, {
      success: true,
      message: "Call invitation sent.",
    });
  }
);
