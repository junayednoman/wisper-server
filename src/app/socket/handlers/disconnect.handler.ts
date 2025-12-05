import prisma from "../../utils/prisma";
import { TSocket } from "../interface/socket.interface";
import eventHandler from "../utils/eventHandler";
import onlineUsers from "../utils/onlineUsers";
import typingState from "../utils/typingState";

const disconnect = eventHandler(async (socket: TSocket) => {
  const userId = socket.auth.id;

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

  delete onlineUsers[userId];
});

export default disconnect;
