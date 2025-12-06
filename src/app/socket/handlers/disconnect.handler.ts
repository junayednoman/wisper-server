import { ChatType } from "@prisma/client";
import { chatService } from "../../modules/chat/chat.service";
import prisma from "../../utils/prisma";
import { TSocket } from "../interface/socket.interface";
import eventHandler from "../utils/eventHandler";
import onlineUsers from "../utils/onlineUsers";
import typingState from "../utils/typingState";

const disconnect = eventHandler(async (socket: TSocket) => {
  const userId = socket.auth.id;
  delete onlineUsers[userId];

  // handle stop typing
  typingState.forEach((userSet, chatId) => {
    if (userSet.has(userId)) {
      userSet.delete(userId);

      socket.to(chatId).emit("typingStatus", {
        chatId,
        userId,
        isTyping: false,
      });

      prisma.chat
        .findUnique({
          where: { id: chatId },
          select: { participants: { select: { authId: true } } },
        })
        .then(chat => {
          chat?.participants.forEach(p => {
            const userSocket = onlineUsers[p.authId];
            if (userSocket && userSocket.auth.id !== userId) {
              userSocket.emit("chatList:typing", {
                chatId,
                typingUsers: Array.from(userSet),
              });
            }
          });
        });
    }
  });

  // handle update online status
  const chatList = await chatService.getMyChats(socket.auth.id, {}, {});

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
});

export default disconnect;
