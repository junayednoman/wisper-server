import prisma from "../../utils/prisma";
import { TSocket } from "../interface/socket.interface";
import { handleSocketError } from "../utils/handleSocketError";

export const joinChatHandler = async (socket: TSocket) => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            authId: socket.auth.id,
          },
        },
      },
      select: {
        id: true,
      },
    });
    for (const chat of chats) {
      socket.join(chat.id);
    }
  } catch (err: unknown) {
    handleSocketError(err, socket);
  }
};
