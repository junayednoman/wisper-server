import prisma from "../../utils/prisma";

const addRemoveReaction = async (postId: string, authId: string) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
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
