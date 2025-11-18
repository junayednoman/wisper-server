import { z } from "zod";

export const sendMessageZod = z
  .object({
    chatId: z
      .string()
      .uuid({ message: "chatId is required and must be a valid UUID" }),
    text: z.string().min(1, { message: "Text is required" }),
    file: z.string().optional(),
    fileType: z.enum(["IMAGE", "VIDEO", "AUDIO", "DOC"]).optional(),
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
