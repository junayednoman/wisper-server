import z from "zod";

export const callZod = z.object({
  type: z.enum(["VIDEO", "AUDIO"]),
  mode: z.enum(["ONE_TO_ONE", "GROUP"]),
  roomId: z.string(),
  duration: z.number(),
  participants: z.array(
    z.object({
      id: z.string().uuid({ message: "Invalid participant id" }),
      status: z.enum(["MISSED", "OUTGOING", "INCOMING"]),
    })
  ),
});

export const callTokenZod = z.object({
  callId: z.string().uuid({ message: "Invalid call id" }),
  roomId: z.string().min(1),
  uid: z.union([z.number().int().nonnegative(), z.string().min(1)]),
  role: z.enum(["PUBLISHER", "SUBSCRIBER"]),
});

export type TCall = z.infer<typeof callZod>;
export type TCallParticipant = z.infer<typeof callZod>["participants"][0];
export type TCallTokenPayload = z.infer<typeof callTokenZod>;
