import { messageService } from "../../modules/message/message.service";
import prisma from "../../utils/prisma";
import { TMessagePayload } from "../interface/message.interface";
import { TAckFn, TSocket } from "../interface/socket.interface";
import ackHandler from "../utils/ackHandler";
import eventHandler from "../utils/eventHandler";

export const sendMessage = eventHandler<TMessagePayload>(
  async (socket: TSocket, data, ack: TAckFn) => {
    await prisma.chat.findUniqueOrThrow({
      where: {
        id: data.chatId,
      },
    });

    data.senderId = socket.auth.id;

    socket.to(data.chatId).emit("newMessage", data);

    await messageService.sendMessage(socket.auth.id, data);

    ackHandler(ack, {
      success: true,
      message: "Message sent successfully",
    });
  }
);
