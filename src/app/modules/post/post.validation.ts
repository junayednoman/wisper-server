import { z } from "zod";

export const CreatePostZod = z.object({
  caption: z.string().optional(),
  commentAccess: z.enum(["FOLLOWERS", "EVERYONE"], {
    message: "Comment access must be either FOLLOWERS or EVERYONE",
  }),
});

export type TCreatePost = z.infer<typeof CreatePostZod> & {
  images: string[];
  authorId: string;
};

export const CommentAccessZod = z.object({
  commentAccess: z.enum(["FOLLOWERS", "EVERYONE"], {
    message: "Comment access must be either FOLLOWERS or EVERYONE",
  }),
});
