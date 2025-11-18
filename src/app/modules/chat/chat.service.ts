import { ChatRole, ChatType, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import {
  TBlockParticipantZod,
  TCreateChatZod,
  TMuteChatZod,
  TRemoveParticipantZod,
} from "./chat.validation";
import ApiError from "../../middlewares/classes/ApiError";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";

const createChat = async (authId: string, payload: TCreateChatZod) => {
  if (authId == payload.participantId)
    throw new ApiError(400, "You cannot create a chat with yourself!");
  const participantIds = [authId, payload.participantId];
  const existingChat = await prisma.chat.findFirst({
    where: {
      type: ChatType.INDIVIDUAL,
      AND: participantIds.map(id => ({
        participants: { some: { authId: id } },
      })),
    },
  });

  if (existingChat) throw new ApiError(400, "Chat already exists!");

  const chatPayload = {
    type: ChatType.INDIVIDUAL,
  };
  const result = await prisma.$transaction(async tn => {
    const newChat = await tn.chat.create({
      data: chatPayload,
    });

    const participantPayloads = participantIds.map(id => ({
      chatId: newChat.id,
      authId: id,
      role: ChatRole.MEMBER,
    }));

    await tn.chatParticipant.createMany({ data: participantPayloads });

    return newChat;
  });

  return result;
};

const getMyChats = async (
  authId: string,
  options: TPaginationOptions,
  query: Record<string, any>
) => {
  const { searchTerm } = query;

  const andConditions: Prisma.ChatWhereInput[] = [];

  andConditions.push({ participants: { some: { authId } } });

  // filter out deleted chats
  andConditions.push({
    chatDeletions: {
      none: {
        authId,
      },
    },
  });

  if (searchTerm) {
    andConditions.push({
      OR: [
        { group: { name: { contains: searchTerm, mode: "insensitive" } } },
        { class: { name: { contains: searchTerm, mode: "insensitive" } } },
        {
          participants: {
            some: {
              auth: {
                OR: [
                  {
                    person: {
                      name: { contains: searchTerm, mode: "insensitive" },
                    },
                  },
                  {
                    business: {
                      name: { contains: searchTerm, mode: "insensitive" },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);

  const chats = await prisma.chat.findMany({
    where: whereConditions,
    select: {
      id: true,
      type: true,
      latestMessageAt: true,
      participants: {
        select: {
          id: true,
          auth: {
            select: {
              id: true,
              person: { select: { name: true, image: true } },
              business: { select: { name: true, image: true } },
            },
          },
        },
      },
      group: { select: { image: true, name: true } },
      class: { select: { image: true, name: true } },
      messages: {
        select: {
          id: true,
          text: true,
          file: true,
          fileType: true,
          sender: {
            select: {
              id: true,
              person: { select: { name: true } },
              business: { select: { name: true } },
            },
          },
        },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          messages: {
            where: {
              NOT: {
                messagesSeen: {
                  some: { participant: { authId } },
                },
              },
              senderId: { not: authId },
            },
          },
        },
      },
    },
    skip,
    take,
    orderBy:
      sortBy && orderBy ? { [sortBy]: orderBy } : { latestMessageAt: "desc" },
  });

  const total = await prisma.chat.count({ where: whereConditions });
  const meta = { page, limit: take, total };
  return { meta, chats };
};

const muteChat = async (authId: string, payload: TMuteChatZod) => {
  await prisma.chat.findUniqueOrThrow({
    where: {
      id: payload.chatId,
    },
  });

  payload.mutedAt = new Date();
  payload.authId = authId;

  const result = await prisma.chatMute.upsert({
    where: {
      authId_chatId: {
        authId,
        chatId: payload.chatId,
      },
    },
    create: payload,
    update: payload,
  });
  return result;
};

const unmuteChat = async (authId: string, chatId: string) => {
  await prisma.chat.findUniqueOrThrow({
    where: {
      id: chatId,
    },
  });

  const result = await prisma.chatMute.delete({
    where: {
      authId_chatId: {
        authId,
        chatId,
      },
    },
  });
  return result;
};

const removeParticipant = async (
  authId: string,
  payload: TRemoveParticipantZod
) => {
  await prisma.chat.findUniqueOrThrow({
    where: {
      id: payload.chatId,
    },
  });

  await prisma.chatParticipant.findUniqueOrThrow({
    where: {
      id: payload.participantId,
    },
  });

  const myParticipant = await prisma.chatParticipant.findFirst({
    where: {
      chatId: payload.chatId,
      authId,
    },
    select: {
      role: true,
      chat: {
        select: {
          type: true,
        },
      },
    },
  });

  if (
    myParticipant?.chat.type !== ChatType.GROUP &&
    myParticipant?.chat.type !== ChatType.CLASS
  )
    throw new ApiError(
      400,
      "You can only remove participants from groups & classes!"
    );

  if (myParticipant?.role !== ChatRole.ADMIN)
    throw new ApiError(403, "You are not an admin of this chat!");

  const result = await prisma.chatParticipant.delete({
    where: {
      id: payload.participantId,
    },
  });
  return result;
};

const blockChatParticipant = async (
  authId: string,
  payload: TBlockParticipantZod
) => {
  await prisma.chat.findUniqueOrThrow({
    where: {
      id: payload.chatId,
    },
  });

  await prisma.auth.findUniqueOrThrow({
    where: {
      id: payload.authId,
    },
  });

  if (authId === payload.authId)
    throw new ApiError(400, "You cannot block yourself!");

  const myParticipant = await prisma.chatParticipant.findFirst({
    where: {
      chatId: payload.chatId,
      authId,
    },
    select: {
      role: true,
      chat: {
        select: {
          type: true,
        },
      },
    },
  });

  if (
    myParticipant?.chat.type === ChatType.GROUP ||
    myParticipant?.chat.type === ChatType.CLASS
  ) {
    if (myParticipant?.role !== ChatRole.ADMIN)
      throw new ApiError(403, "Only admin can block a participant!");
  }

  const alreadyBlocked = await prisma.blockedChatParticipant.findFirst({
    where: {
      authId: payload.authId,
      chatId: payload.chatId,
    },
  });

  if (alreadyBlocked)
    throw new ApiError(400, "Chat participant is already blocked!");

  const result = await prisma.blockedChatParticipant.create({
    data: {
      authId: payload.authId,
      chatId: payload.chatId,
    },
  });

  return result;
};

const unBlockChatParticipant = async (
  authId: string,
  payload: TBlockParticipantZod
) => {
  const blockedChatParticipant =
    await prisma.blockedChatParticipant.findFirstOrThrow({
      where: {
        authId: payload.authId,
        chatId: payload.chatId,
      },
    });

  const myParticipant = await prisma.chatParticipant.findFirst({
    where: {
      chatId: blockedChatParticipant.chatId,
      authId,
    },
    select: {
      role: true,
      chat: {
        select: {
          type: true,
        },
      },
    },
  });

  if (
    myParticipant?.chat.type === ChatType.GROUP ||
    myParticipant?.chat.type === ChatType.CLASS
  ) {
    if (myParticipant?.role !== ChatRole.ADMIN)
      throw new ApiError(403, "Only admin can unblock a participant!");
  }

  const result = await prisma.blockedChatParticipant.delete({
    where: {
      id: blockedChatParticipant.id,
    },
  });

  return result;
};

const deleteChat = async (authId: string, chatId: string) => {
  await prisma.chat.findUniqueOrThrow({
    where: {
      id: chatId,
    },
  });

  const existingDeletion = await prisma.chatDeletion.findFirst({
    where: {
      authId,
      chatId,
    },
  });

  if (existingDeletion) {
    throw new ApiError(400, "You have already deleted this chat!");
  }

  const result = await prisma.chatDeletion.create({
    data: {
      authId,
      chatId,
    },
  });

  return result;
};

export const chatService = {
  createChat,
  getMyChats,
  muteChat,
  unmuteChat,
  removeParticipant,
  blockChatParticipant,
  unBlockChatParticipant,
  deleteChat,
};
