import prisma from "../../utils/prisma";
import { sendNotificationToUser } from "../../utils/sendNotification";

const addRemoveReaction = async (postId: string, authId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      authorId: true,
    },
  });

  const existingReaction = await prisma.reaction.findFirst({
    where: {
      postId,
      authId,
    },
  });

  if (existingReaction) {
    await prisma.reaction.delete({
      where: {
        id: existingReaction.id,
      },
    });
    const message = "Reaction removed successfully!";
    return { result: existingReaction, message };
  } else {
    const reactionPayload = {
      postId,
      authId,
    };

    const result = await prisma.reaction.create({
      data: reactionPayload,
    });

    if (post.authorId !== authId) {
      await sendNotificationToUser(
        post.authorId,
        "New reaction",
        "Someone liked your post."
      );
    }

    const message = "Reaction added successfully!";
    return { result, message };
  }
};

const getPostReactions = async (postId: string) => {
  const result = await prisma.reaction.findMany({
    where: {
      postId,
    },
  });
  return result;
};

export const ReactionService = { addRemoveReaction, getPostReactions };
