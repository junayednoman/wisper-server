import { z } from "zod";

export const sendMessageZod = z
  .object({
    chatId: z
      .string()
      .uuid({ message: "chatId is required and must be a valid UUID" }),
    text: z.string().optional(),
    file: z.string().optional(),
    fileType: z.enum(["IMAGE", "VIDEO", "AUDIO", "DOC"]).optional(),
    link: z.string().optional(),
  })
  .refine(
    data => {
      if (data.file) return !!data.fileType;
      return true;
    },
    {
      message: "fileType is required when file is attached",
      path: ["fileType"],
    }
  );

export type TSendMessage = z.infer<typeof sendMessageZod>;

export const seenMessagesZod = z.object({
  messageIds: z
    .array(z.string().uuid({ message: "Each messageId must be a valid UUID" }))
    .min(1, { message: "At least one messageId is required" }),
});

export type TSeenMessages = z.infer<typeof seenMessagesZod>;
