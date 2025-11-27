import z from "zod";

export const createPaymentSessionZod = z.object({
  packageId: z.string().uuid({ message: "Invalid package id" }),
  postId: z.string().uuid({ message: "Invalid post id" }),
  targetIndustry: z.string().optional(),
});

export type TCreatePaymentSession = z.infer<typeof createPaymentSessionZod>;
