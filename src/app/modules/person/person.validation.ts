import { z } from "zod";
import { emailZod, passwordZod } from "../../validation/global.validation";

export const personSignupZod = z.object({
  password: passwordZod,
  person: z.object({
    email: emailZod,
    name: z.string({ message: "Name is required" }).min(2, "Name is too short"),
    phone: z.string().optional(),
    title: z
      .string({ message: "Title is required" })
      .min(4, "Title is too short"),
    industry: z
      .string({ message: "Industry is required" })
      .min(2, "Industry is required"),
  }),
});

export type TPersonSignUp = z.infer<typeof personSignupZod>;
