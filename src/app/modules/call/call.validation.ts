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

export type TCall = z.infer<typeof callZod>;
export type TCallParticipant = z.infer<typeof callZod>["participants"][0];
