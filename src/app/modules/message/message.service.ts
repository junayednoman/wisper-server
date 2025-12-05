import { ChatType } from "@prisma/client";
import ApiError from "../../middlewares/classes/ApiError";
import prisma from "../../utils/prisma";
import { TSeenMessages, TSendMessage } from "./message.validation";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";

const sendMessage = async (authId: string, payload: TSendMessage) => {
  const chat = await prisma.chat.findUniqueOrThrow({
    where: { id: payload.chatId },
    select: {
      id: true,
      type: true,
      blockedChatParticipants: true,
      participants: {
        select: {
          auth: {
            select: {
              id: true,
              business: {
                select: {
                  name: true,
                },
              },
              person: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const participantIds = chat.participants.map(p => p.auth.id);
  if (!participantIds.includes(authId)) {
    throw new ApiError(403, "You are not a participant of this chat!");
  }
  const partners = chat.participants.filter(p => p.auth.id !== authId);
  const partnerName =
    partners[0]?.auth.business?.name || partners[0]?.auth.person?.name;

  if (chat.blockedChatParticipants.some(bcp => bcp.authId === authId)) {
    throw new ApiError(
      400,
      `Can't send message! ${chat.type === ChatType.INDIVIDUAL ? `${partnerName} has blocked you!` : "You are blocked in this chat."}`
    );
  }

  const messagePayload = {
    ...payload,
    senderId: authId,
  };

  const result = await prisma.$transaction(async tx => {
    const newMessage = await tx.message.create({
      data: messagePayload,
    });

    await tx.chat.update({
      where: { id: chat.id },
      data: {
        latestMessageAt: new Date(),
      },
    });

    return newMessage;
  });

  return result;
};

const getMessagesByChat = async (
  authId: string,
  chatId: string,
  options: TPaginationOptions
) => {
  const chat = await prisma.chat.findUniqueOrThrow({
    where: { id: chatId },
    select: {
      participants: {
        select: { authId: true },
      },
    },
  });

  const participantIds = chat.participants.map(p => p.authId);
  if (!participantIds.includes(authId)) {
    throw new ApiError(403, "You are not a participant of this chat!");
  }

  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);

  const messages = await prisma.message.findMany({
    where: { chatId },
    select: {
      id: true,
      chatId: true,
      sender: {
        select: {
          person: { select: { id: true, name: true, image: true } },
          business: { select: { id: true, name: true, image: true } },
        },
      },
      text: true,
      file: true,
      fileType: true,
      isEdited: true,
      createdAt: true,
      messagesSeen: {
        select: {
          participant: {
            select: {
              auth: { select: { id: true } },
            },
          },
        },
      },
    },
    skip,
    take,
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { createdAt: "asc" },
  });

  const formattedMessages = messages.map(msg => {
    const seenIds = msg.messagesSeen.map(s => s.participant.auth.id);

    const isRead = seenIds.includes(authId);

    return {
      ...msg,
      messagesSeen: undefined,
      isRead,
    };
  });

  const total = await prisma.message.count({ where: { chatId } });

  return {
    meta: { page, limit: take, total },
    messages: formattedMessages,
  };
};

const updateMessage = async (
  authId: string,
  messageId: string,
  payload: Partial<TSendMessage>
) => {
  const message = await prisma.message.findUniqueOrThrow({
    where: { id: messageId },
    select: {
      senderId: true,
    },
  });
  console.log("message.senderId, ", message.senderId, authId);
  if (message.senderId !== authId) {
    throw new ApiError(403, "You are not authorized to update this message!");
  }

  const result = await prisma.message.update({
    where: { id: messageId },
    data: {
      ...payload,
      isEdited: true,
    },
  });

  return result;
};

const seenMessages = async (authId: string, payload: TSeenMessages) => {
  const message = await prisma.message.findUniqueOrThrow({
    where: { id: payload.messageIds[0] },
    select: {
      chat: {
        select: {
          participants: {
            select: {
              id: true,
              authId: true,
            },
          },
        },
      },
    },
  });

  const participants = message.chat.participants.filter(
    p => p.authId === authId
  );

  const myParticipantId = participants.find(p => p.authId === authId)
    ?.id as string;

  const seenPayloads = payload.messageIds.map(id => ({
    messageId: id,
    participantId: myParticipantId,
  }));

  const result = await prisma.messageSeen.createMany({
    data: seenPayloads,
    skipDuplicates: true,
  });

  return result;
};

export const messageService = {
  sendMessage,
  getMessagesByChat,
  updateMessage,
  seenMessages,
};
