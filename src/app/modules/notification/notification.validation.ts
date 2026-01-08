import z from "zod";

export const notificationDeleteValidation = z.object({
  ids: z.array(z.string().uuid()),
});
