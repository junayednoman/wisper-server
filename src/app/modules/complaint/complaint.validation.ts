import z from "zod";

export const complaintZod = z.object({
  postId: z.string().uuid({ message: "Invalid post id" }).optional(),
  accountId: z.string().uuid({ message: "Invalid account id" }).optional(),
  type: z.enum(["POST", "ACCOUNT"]),
  reason: z.string(),
});

export type TComplaint = z.infer<typeof complaintZod> & {
  complainantId: string;
};
