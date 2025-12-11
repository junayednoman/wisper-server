import { chatService } from "../../modules/chat/chat.service";
import { messageService } from "../../modules/message/message.service";
import prisma from "../../utils/prisma";
import { TMessagePayload } from "../interface/message.interface";
import { TAckFn, TSocket } from "../interface/socket.interface";
import ackHandler from "../utils/ackHandler";
import eventHandler from "../utils/eventHandler";

export const sendMessage = eventHandler<TMessagePayload>(
  async (socket: TSocket, data, ack: TAckFn) => {
    const authId = socket.auth.id;
    await prisma.chat.findUniqueOrThrow({
      where: {
        id: data.chatId,
      },
    });

    data.senderId = authId;

    await messageService.sendMessage(authId, data);
    const chatList = await chatService.getMyChats(authId, {}, {});
    socket.emit("chatList", chatList);

    const messages = await prisma.message.findMany({
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

    socket.to(data.chatId).emit("newMessage", messages[0]);
    socket.emit("newMessage", messages[0]);

    ackHandler(ack, {
      success: true,
      message: "Message sent successfully",
    });
  }
);
