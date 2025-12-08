import { FileType } from "@prisma/client";

export type TMessagePayload = {
  senderId: string;
  chatId: string;
  text?: string;
  file?: string;
  fileType?: FileType;
  link?: string;
};

export type TEditMessage = {
  messageId: string;
  payload: {
    text?: string;
    file?: string;
    fileType?: FileType;
    link?: string;
  };
};

export type TDeleteMessage = {
  messageId: string;
};

export type TSeenMessage = {
  chatId: string;
  messageIds: string[];
};
