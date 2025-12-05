import prisma from "../../utils/prisma";
import { TAckFn, TSocket } from "../interface/socket.interface";
import { TTypingPayload } from "../interface/startTyping.interface";
import eventHandler from "../utils/eventHandler";
import onlineUsers from "../utils/onlineUsers";
import typingState from "../utils/typingState";

const startTyping = eventHandler<TTypingPayload>(
  async (socket: TSocket, data, _ack: TAckFn) => {
    if (!typingState.has(data.chatId)) typingState.set(data.chatId, new Set());
    typingState.get(data.chatId)!.add(socket.auth.id);

    const chat = await prisma.chat.findUnique({
      where: { id: data.chatId },
      select: { participants: { select: { authId: true } } },
    });

    chat?.participants.forEach(p => {
      const userSocket = onlineUsers[p.authId];
      if (userSocket) {
        userSocket.emit("chatList:typing", {
          chatId: data.chatId,
          typingUsers: Array.from(typingState.get(data.chatId)!),
        });
      }
    });

    socket.to(data.chatId).emit("typingStatus", {
      chatId: data.chatId,
      userId: socket.auth.id,
      isTyping: true,
    });
  }
);

export default startTyping;
