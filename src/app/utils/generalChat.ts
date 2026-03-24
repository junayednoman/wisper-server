import { Prisma, PrismaClient } from "@prisma/client";
import config from "../config";

type PrismaClientLike = Prisma.TransactionClient | PrismaClient;

export const addUserToGeneralChat = async (
  prismaClient: PrismaClientLike,
  authId: string
) => {
  const generalChatId = config.generalChatId;
  if (!generalChatId) return;

  const generalChat = await prismaClient.chat.findUnique({
    where: {
      id: generalChatId,
    },
    select: {
      id: true,
    },
  });

  if (!generalChat) return;

  const existingParticipant = await prismaClient.chatParticipant.findFirst({
    where: {
      chatId: generalChatId,
      authId,
    },
    select: {
      id: true,
    },
  });

  if (existingParticipant) return;

  await prismaClient.chatParticipant.create({
    data: {
      chatId: generalChatId,
      authId,
    },
  });
};
