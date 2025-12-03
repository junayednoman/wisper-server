import { FileType } from "@prisma/client";

export type TMessagePayload = {
  senderId: string;
  chatId: string;
  text: string;
  file?: string;
  fileType?: FileType;
};
