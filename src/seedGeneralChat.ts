import { ChatType } from "@prisma/client";
import config from "./app/config";
import prisma from "./app/utils/prisma";

const seedGeneralChat = async () => {
  try {
    if (config.generalChatId) {
      const existingById = await prisma.chat.findUnique({
        where: {
          id: config.generalChatId,
        },
        select: {
          id: true,
        },
      });

      if (existingById) {
        console.log(`General chat already exists: ${existingById.id}`);
        return;
      }
    }

    const existing = await prisma.chat.findFirst({
      where: {
        type: ChatType.GROUP,
        groupId: null,
        classId: null,
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      console.log(`General chat found: ${existing.id}`);
      return;
    }

    const created = await prisma.chat.create({
      data: {
        type: ChatType.GROUP,
      },
      select: {
        id: true,
      },
    });

    console.log(`General chat created: ${created.id}`);
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedGeneralChat();
