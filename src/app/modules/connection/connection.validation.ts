import z from "zod";

export const connectionRequestZod = z.object({
  receiverId: z.string().uuid(),
});

export const acceptConnectionRequestZod = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
});
