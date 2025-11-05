import { Comment } from "@prisma/client";
import prisma from "../../utils/prisma";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";
import ApiError from "../../middlewares/classes/ApiError";

const addComment = async (userId: string, postId: string, payload: Comment) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  payload.authorId = userId;
  payload.postId = postId;

  const result = await prisma.comment.create({ data: payload });
  return result;
};

const getAll = async (postId: string, options: TPaginationOptions) => {
  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);
  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      createdAt: true,
      text: true,
      isEdited: true,
      author: {
        select: {
          id: true,
          role: true,
          person: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          business: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
    skip,
    take,
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { createdAt: "desc" },
  });

  const total = await prisma.comment.count({
    where: {
      postId,
    },
  });

  const meta = {
    page,
    limit: take,
    total,
  };
  return { meta, comments };
};

const editComment = async (id: string, userId: string, text: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
  });
  if (userId !== comment.authorId) throw new ApiError(401, "Unauthorized");

  const result = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      text,
      isEdited: true,
    },
  });
  return result;
};

const deleteComment = async (id: string, userId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
  });
  if (userId !== comment.authorId) throw new ApiError(401, "Unauthorized");

  const result = await prisma.comment.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CommentService = {
  addComment,
  getAll,
  editComment,
  deleteComment,
};
