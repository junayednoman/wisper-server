import { chatService } from "../../../modules/chat/chat.service";
import { messageService } from "../../../modules/message/message.service";
import prisma from "../../../utils/prisma";
import { sendNotificationToUser } from "../../../utils/sendNotification";
import { TMessagePayload } from "../../interface/message.interface";
import { TAckFn, TSocket } from "../../interface/socket.interface";
import ackHandler from "../../utils/ackHandler";
import eventHandler from "../../utils/eventHandler";
import onlineUsers from "../../utils/onlineUsers";

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

    const messages = await prisma.message.findMany({
      where: {
        chatId: data.chatId,
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
        createdAt: "desc",
      },
      take: 1,
    });

    socket.to(data.chatId).emit("newMessage", messages[0]);
    socket.emit("newMessage", messages[0]);

    const participants = await prisma.chatParticipant.findMany({
      where: {
        chatId: data.chatId,
      },
      select: {
        authId: true,
      },
    });

    const recipientIds = participants
      .map(participant => participant.authId)
      .filter(participantId => participantId !== authId);

    const onlineRecipientIds = recipientIds.filter(
      participantId => onlineUsers[participantId]
    );

    await Promise.all(
      onlineRecipientIds.map(async receiverId => {
        const receiverChatList = await chatService.getMyChats(
          receiverId,
          {},
          {}
        );
        onlineUsers[receiverId]?.emit("chatList", receiverChatList);
      })
    );

    const offlineIds = recipientIds.filter(
      participantId => !onlineUsers[participantId]
    );

    const senderName =
      messages[0]?.sender?.person?.name ||
      messages[0]?.sender?.business?.name ||
      "New message";

    const getSnippet = (text?: string | null) => {
      if (!text) return "Sent a file.";
      const words = text.trim().split(/\s+/);
      const snippet = words.slice(0, 12).join(" ");
      return words.length > 12 ? `${snippet}...` : snippet;
    };

    const messageSnippet = getSnippet(messages[0]?.text);

    await Promise.all(
      offlineIds.map(receiverId =>
        sendNotificationToUser(receiverId, senderName, messageSnippet, {
          chatId: data.chatId,
        })
      )
    );

    ackHandler(ack, {
      success: true,
      message: "Message sent successfully",
    });
  }
);
