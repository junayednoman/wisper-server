import prisma from "../../utils/prisma";
import { TDeleteMessage } from "../interface/message.interface";
import { TAckFn, TSocket } from "../interface/socket.interface";
import ackHandler from "../utils/ackHandler";
import eventHandler from "../utils/eventHandler";

const deleteMessage = eventHandler<TDeleteMessage>(
  async (socket: TSocket, data, ack: TAckFn) => {
    const authId = socket.auth.id;

    const message = await prisma.message.findUniqueOrThrow({
      where: {
        id: data.messageId,
      },
    });

    if (message.senderId !== authId) {
      ackHandler(ack, { success: false, message: "Unauthorized to delete!" });
    }

    await prisma.message.delete({
      where: {
        id: data.messageId,
      },
    });

    const newMessages = await prisma.message.findMany({
      where: {
        chatId: message.chatId,
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
        createdAt: "asc",
      },
      take: 1,
    });

    socket.to(message.chatId).emit("newMessage", newMessages[0]);
    socket.emit("newMessage", newMessages[0]);
  }
);

export default deleteMessage;
