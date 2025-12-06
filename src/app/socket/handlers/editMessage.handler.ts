import { messageService } from "../../modules/message/message.service";
import prisma from "../../utils/prisma";
import { TEditMessage } from "../interface/message.interface";
import { TAckFn, TSocket } from "../interface/socket.interface";
import ackHandler from "../utils/ackHandler";
import eventHandler from "../utils/eventHandler";

const editMessage = eventHandler<TEditMessage>(
  async (socket: TSocket, data, ack: TAckFn) => {
    const authId = socket.auth.id;

    const message = await prisma.message.findUniqueOrThrow({
      where: {
        id: data.messageId,
      },
    });

    if (message.senderId !== authId) {
      ackHandler(ack, { success: false, message: "Unauthorized to edit!" });
    }

    await prisma.message.update({
      where: {
        id: data.messageId,
      },
      data: data.payload,
    });

    const messages = await messageService.getMessagesByChat(
      authId,
      message.chatId,
      {}
    );

    socket.to(message.chatId).emit("chatMessages", messages);
  }
);

export default editMessage;
