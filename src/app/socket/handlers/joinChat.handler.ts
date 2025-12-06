import { ChatType } from "@prisma/client";
import { chatService } from "../../modules/chat/chat.service";
import { TSocket } from "../interface/socket.interface";
import { handleSocketError } from "../utils/handleSocketError";
import onlineUsers from "../utils/onlineUsers";

export const joinChatHandler = async (socket: TSocket) => {
  try {
    const chatList = await chatService.getMyChats(socket.auth.id, {}, {});
    for (const chat of chatList.chats) {
      socket.join(chat.id);
    }

    // emit chat list
    chatList.chats.forEach(chat => {
      if (chat.type === ChatType.INDIVIDUAL) {
        chat.participants.forEach((p: any) => {
          p.isOnline = Boolean(onlineUsers[p.auth.id]);
        });
      }
    });

    socket.emit("chatList", chatList);

    // emit online status to all the online participants
    chatList.chats.forEach(chat => {
      if (chat.type === ChatType.INDIVIDUAL) {
        chat.participants.forEach((p: any) => {
          const userSocket = onlineUsers[p.auth.id];
          if (userSocket) {
            userSocket.emit("chatList", chatList);
          }
        });
      }
    });
  } catch (err: unknown) {
    handleSocketError(err, socket);
  }
};
