import { z } from "zod";
import { emailZod, passwordZod } from "../../validation/global.validation";

export const businessSignupZod = z.object({
  password: passwordZod,
  business: z.object({
    email: emailZod,
    name: z.string({ message: "Name is required" }).min(2, "Name is too short"),
    industry: z
      .string({ message: "Industry is required" })
      .min(2, "Industry is required"),
  }),
});

export type TBusinessSignup = z.infer<typeof businessSignupZod>;
