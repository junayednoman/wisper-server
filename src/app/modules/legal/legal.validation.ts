import { z } from "zod";

export const legalInfoZod = z.object({
  privacyPolicy: z.string().min(1, "privacyPolicy is required"),
  termsAndConditions: z.string().min(1, "termsAndConditions is required"),
  aboutUs: z.string().min(1, "aboutUs is required"),
});

export type TLegalInfo = z.infer<typeof legalInfoZod>;
