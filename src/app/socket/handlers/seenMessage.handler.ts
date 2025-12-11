import { messageService } from "../../modules/message/message.service";
import prisma from "../../utils/prisma";
import { TSeenMessage } from "../interface/message.interface";
import { TSocket } from "../interface/socket.interface";
import eventHandler from "../utils/eventHandler";

export const seenMessage = eventHandler<TSeenMessage>(
  async (socket: TSocket, data) => {
    const authId = socket.auth.id;

    await messageService.seenMessages(authId, data);

    const newMessages = await prisma.message.findMany({
      where: {
        chatId: data.chatId,
      },
      select: {
        id: true,
        chatId: true,
        sender: {
          select: {
            id: true,
            person: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            business: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        text: true,
        file: true,
        fileType: true,
        isEdited: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    socket.to(data.chatId).emit("newMessage", newMessages[0]);
    socket.emit("newMessage", newMessages[0]);
  }
);
