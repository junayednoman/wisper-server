import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string(),
  description: z.string().min(10),
  type: z.enum(["PART_TIME", "FULL_TIME", "CONTRACT"]),
  experienceLevel: z.enum(["ENTRY_LEVEL", "JUNIOR", "MID_LEVEL", "SENIOR"]),
  compensationType: z.enum(["MONTHLY", "ONE_OFF"]),
  salary: z.number().positive(),
  locationType: z.enum(["ON_SITE", "HYBRID", "REMOTE"]),
  location: z.string().optional(),
  industry: z.string().min(2),
  qualification: z.enum(["BSC", "PHD", "HND", "OND"]),
  requirements: z.array(z.string().min(3)).nonempty(),
  responsibilities: z.array(z.string().min(3)).nonempty(),
  applicationType: z.enum(["EMAIL", "EXTERNAL", "CHAT"]),
  applicationLink: z.string().url().optional(),
});
