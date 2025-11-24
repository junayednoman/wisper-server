import { Prisma } from "@prisma/client";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";
import prisma from "../../utils/prisma";
import { TComplaint } from "./complaint.validation";

const createComplaint = async (userId: string, payload: TComplaint) => {
  if (payload.postId) {
    await prisma.post.findUniqueOrThrow({
      where: {
        id: payload.postId,
      },
    });
  }
  if (payload.accountId) {
    await prisma.auth.findUniqueOrThrow({
      where: {
        id: payload.accountId,
      },
    });
  }

  payload.complainantId = userId;

  const result = await prisma.complaint.create({ data: payload });
  return result;
};

const getAllComplaints = async (
  options: TPaginationOptions,
  query: Record<string, any>
) => {
  const { searchTerm, type } = query;

  const andConditions: Prisma.ComplaintWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          account: {
            person: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
        {
          post: {
            OR: [
              {
                caption: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ],
    });
  }
  if (type) {
    andConditions.push({
      type,
    });
  }
  const whereConditions: Prisma.ComplaintWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const { page, take, skip } = calculatePagination(options);
  const complaints = await prisma.complaint.findMany({
    where: whereConditions,
    select: {
      id: true,
      type: true,
      status: true,
      date: true,
      account: {
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
      post: {
        select: {
          id: true,
          images: true,
          caption: true,
          views: true,
          createdAt: true,
        },
      },
    },
    skip,
    take,
    orderBy: { date: "desc" },
  });

  const total = await prisma.complaint.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit: take,
    total,
  };
  return { meta, complaints };
};

export const complaintService = { createComplaint, getAllComplaints };
