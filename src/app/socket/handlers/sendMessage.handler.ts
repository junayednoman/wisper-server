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

    const messages = await messageService.getMessagesByChat(
      authId,
      data.chatId,
      {}
    );

    socket.to(data.chatId).emit("chatMessages", messages);

    ackHandler(ack, {
      success: true,
      message: "Message sent successfully",
    });
  }
);
