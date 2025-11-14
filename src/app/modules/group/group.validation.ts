import * as z from "zod";

export const createGroupZod = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isPrivate: z.boolean(),
  allowInvitation: z.boolean(),
  members: z
    .array(z.string().uuid())
    .nonempty("At least one member is required"),
});

export type TCreateGroup = z.infer<typeof createGroupZod>;

export const addGroupMemberZod = z.object({
  member: z.string().uuid({ message: "Invalid member id" }),
});

export const updateGroupDataZod = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export type TUpdateGroupData = z.infer<typeof updateGroupDataZod>;
