import * as z from "zod";

export const createClassZod = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isPrivate: z.boolean(),
  allowInvitation: z.boolean(),
  members: z
    .array(z.string().uuid())
    .nonempty("At least one member is required"),
});

export type TCreateClass = z.infer<typeof createClassZod>;

export const addClassMemberZod = z.object({
  member: z.string().uuid({ message: "Invalid member id" }),
});

export const updateClassDataZod = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export type TUpdateClassData = z.infer<typeof updateClassDataZod>;
