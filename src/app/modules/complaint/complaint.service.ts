import { ComplaintStatus, Prisma } from "@prisma/client";
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

  andConditions.push({
    status: ComplaintStatus.PENDING,
  });

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          account: {
            OR: [
              {
                person: {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
              {
                business: {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
            ],
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
      reason: true,
      account: {
        select: {
          id: true,
          role: true,
          status: true,
          person: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          business: {
            select: {
              id: true,
              name: true,
              email: true,
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
          author: {
            select: {
              id: true,
              status: true,
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
                  industry: true,
                },
              },
            },
          },
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

const changeComplaintStatus = async (id: string, status: ComplaintStatus) => {
  const result = await prisma.complaint.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  return result;
};

export const complaintService = {
  createComplaint,
  getAllComplaints,
  changeComplaintStatus,
};
