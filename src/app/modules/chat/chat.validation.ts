import z from "zod";

export const createChatZod = z.object({
  participantId: z.string().uuid({ message: "Invalid participant id" }),
});

export type TCreateChatZod = z.infer<typeof createChatZod>;

export const muteChatZod = z.object({
  chatId: z.string().uuid({ message: "Invalid chat id" }),
  muteFor: z.enum(["EIGHT_HOURS", "ONE_WEEK", "ALWAYS"]),
});

export type TMuteChatZod = z.infer<typeof muteChatZod> & {
  authId: string;
  mutedAt: Date;
};

export const removeParticipantZod = z.object({
  chatId: z.string().uuid({ message: "Invalid chat id" }),
  participantId: z.string().uuid({ message: "Invalid participant id" }),
});

export type TRemoveParticipantZod = z.infer<typeof removeParticipantZod>;

export const blockParticipantZod = z.object({
  chatId: z.string().uuid({ message: "Invalid chat id" }),
  authId: z.string().uuid({ message: "Invalid auth id" }),
});

export type TBlockParticipantZod = z.infer<typeof blockParticipantZod>;
