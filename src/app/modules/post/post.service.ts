import { CommentAccess, PostStatus, Prisma } from "@prisma/client";
import { TFile } from "../../interface/file.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";
import prisma from "../../utils/prisma";
import { TCreatePost } from "./post.validation";
import ApiError from "../../middlewares/classes/ApiError";

const create = async (id: string, payload: TCreatePost, files?: TFile[]) => {
  payload.authorId = id;

  if (files && files.length) {
    const images = [];
    for (const file of files) {
      const url = await uploadToS3(file);
      images.push(url);
    }
    payload.images = images;
  }

  const result = await prisma.post.create({
    data: payload,
  });

  return result;
};

const getFeedPosts = async () => {
  return await prisma.post.findMany();
};

const getSingle = async (id: string) => {
  const result = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          id: true,
          role: true,
          person: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              phone: true,
              title: true,
              industry: true,
              address: true,
            },
          },
          business: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              phone: true,
              industry: true,
              address: true,
            },
          },
        },
      },
    },
  });

  return result;
};

const userPosts = async (
  id: string,
  options: TPaginationOptions,
  query?: Record<string, any>
) => {
  const andConditions: Prisma.PostWhereInput[] = [];
  let postStatus = PostStatus.ACTIVE;
  if (query?.status) postStatus = query.status;
  andConditions.push({
    authorId: id,
    status: postStatus,
  });

  const whereConditions: Prisma.PostWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);

  const posts = await prisma.post.findMany({
    where: whereConditions,
    include: {
      author: {
        select: {
          id: true,
          role: true,
          person: {
            select: {
              id: true,
              name: true,
              image: true,
              title: true,
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

  const total = await prisma.post.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit: take,
    total,
  };
  return { meta, posts };
};

const update = async (
  userId: string,
  id: string,
  payload: Partial<TCreatePost>,
  files?: TFile[]
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id,
      status: PostStatus.ACTIVE,
    },
  });

  if (post.authorId !== userId) throw new ApiError(401, "Unauthorized");

  if (files && files.length) {
    const images = post.images || [];
    for (const file of files) {
      const url = await uploadToS3(file);
      images.push(url);
    }
    payload.images = images;
  }

  const result = await prisma.post.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const removeImage = async (userId: string, id: string, url: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (post.authorId !== userId) throw new ApiError(401, "Unauthorized");

  const images = post.images.filter(image => image !== url);
  const result = await prisma.post.update({
    where: {
      id,
    },
    data: {
      images,
    },
  });
  await deleteFromS3(url);
  return result;
};

const updateCommentAccess = async (
  userId: string,
  id: string,
  commentAccess: CommentAccess
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (post.authorId !== userId) throw new ApiError(401, "Unauthorized");

  const result = await prisma.post.update({
    where: {
      id,
    },
    data: {
      commentAccess,
    },
  });
  return result;
};

const changePostStatus = async (
  userId: string,
  id: string,
  status: PostStatus
) => {
  console.log("status, ", status);
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (post.authorId !== userId) throw new ApiError(401, "Unauthorized");
  const result = await prisma.post.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  let message = "";
  if (result.status === PostStatus.ACTIVE) {
    message = "Post restored successfully!";
  } else if (result.status === PostStatus.DELETED) {
    message = "Post deleted successfully!";
  } else if (result.status === PostStatus.TRASHED) {
    message = "Post trashed successfully!";
  }
  return { result, message };
};

export const PostService = {
  create,
  getFeedPosts,
  getSingle,
  userPosts,
  update,
  removeImage,
  updateCommentAccess,
  changePostStatus,
};
