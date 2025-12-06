import { messageService } from "../../modules/message/message.service";
import { TSeenMessage } from "../interface/message.interface";
import { TSocket } from "../interface/socket.interface";
import eventHandler from "../utils/eventHandler";

export const seenMessage = eventHandler<TSeenMessage>(
  async (socket: TSocket, data) => {
    const authId = socket.auth.id;

    await messageService.seenMessages(authId, data);

    // emit chat messages
    const messages = await messageService.getMessagesByChat(
      authId,
      data.chatId,
      {}
    );

    socket.to(data.chatId).emit("chatMessages", messages);
  }
);
