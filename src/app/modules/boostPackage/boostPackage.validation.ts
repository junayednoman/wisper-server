import { z } from "zod";

export const packZod = z.object({
  name: z.string().min(1, "name is required"),
  price: z.number().min(0, "price must be positive"),
  duration: z.string().min(1, "duration must be at least 1 day"),
});

export type TPackType = z.infer<typeof packZod> & {
  status: "ACTIVE" | "INACTIVE";
};
