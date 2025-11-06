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

export const updateBusinessProfileZod = z.object({
  name: z.string().min(2, "Name is too short").optional(),
  phone: z.string().optional(),
  industry: z.string().min(2, "Industry is too short").optional(),
  address: z.string().min(2, "Address is too short").optional(),
});

export type TUpdateBusinessProfile = z.infer<typeof updateBusinessProfileZod>;
