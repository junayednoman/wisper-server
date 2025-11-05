import z from "zod";

export const AddCommentZod = z.object({
  text: z
    .string({ message: "Comment is required" })
    .min(1, "Comment is required"),
});
