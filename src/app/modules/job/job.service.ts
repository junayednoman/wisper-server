import { Job, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";
import { jobFilterableFields, jobSearchableFields } from "./job.constant";
import ApiError from "../../middlewares/classes/ApiError";
import { sendNotificationToUser } from "../../utils/sendNotification";

const ensureGroupMembership = async (groupId: string, userId: string) => {
  const group = await prisma.group.findUniqueOrThrow({
    where: {
      id: groupId,
    },
    select: {
      chat: {
        select: {
          participants: {
            where: {
              authId: userId,
            },
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!(group.chat?.participants.length || 0)) {
    throw new ApiError(403, "You are not a member of this group!");
  }
};

const createJob = async (userId: string, payload: Job) => {
  payload.authorId = userId;

  if (payload.groupId) {
    await ensureGroupMembership(payload.groupId, userId);
  }

  const result = await prisma.job.create({ data: payload });

  if (payload.industry) {
    const recipients = await prisma.auth.findMany({
      where: {
        id: {
          not: userId,
        },
        OR: [
          {
            person: {
              industry: {
                contains: payload.industry,
                mode: "insensitive",
              },
            },
          },
          {
            business: {
              industry: {
                contains: payload.industry,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    await Promise.all(
      recipients.map(recipient =>
        sendNotificationToUser(
          recipient.id,
          "New job posted",
          "A new job was posted in your industry."
        )
      )
    );
  }

  return result;
};

const getAllJobs = async (
  options: TPaginationOptions,
  query: Record<string, any>
) => {
  const { searchTerm, maxSalary, minSalary, postedAfter } = query;
  const andConditions: Prisma.JobWhereInput[] = [];

  // add search
  if (searchTerm) {
    andConditions.push({
      OR: jobSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  jobFilterableFields.forEach(field =>
    andConditions.push({
      [field]: query[field],
    })
  );

  if (maxSalary && minSalary) {
    andConditions.push({
      salary: {
        gte: Number(minSalary),
        lte: Number(maxSalary),
      },
    });
  }

  if (postedAfter) {
    andConditions.push({
      createdAt: {
        gte: postedAfter,
      },
    });
  }

  const whereConditions: Prisma.JobWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);
  const jobs = await prisma.job.findMany({
    where: whereConditions,
    skip,
    take,
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { createdAt: "desc" },
    select: {
      id: true,
      author: {
        select: {
          id: true,
          business: {
            select: {
              id: true,
              name: true,
              industry: true,
              address: true,
              image: true,
            },
          },
        },
      },
      title: true,
      description: true,
      salary: true,
      compensationType: true,
      experienceLevel: true,
      qualification: true,
      responsibilities: true,
      requirements: true,
      applicationType: true,
      locationType: true,
      location: true,
      type: true,
      createdAt: true,
    },
  });

  const total = await prisma.job.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit: take,
    total,
  };
  return { meta, jobs };
};

const getGroupJobs = async (
  groupId: string,
  userId: string,
  options: TPaginationOptions
) => {
  await ensureGroupMembership(groupId, userId);

  const whereConditions: Prisma.JobWhereInput = {
    groupId,
  };

  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);
  const jobs = await prisma.job.findMany({
    where: whereConditions,
    skip,
    take,
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { createdAt: "desc" },
    select: {
      id: true,
      groupId: true,
      author: {
        select: {
          id: true,
          business: {
            select: {
              id: true,
              name: true,
              industry: true,
              address: true,
              image: true,
            },
          },
        },
      },
      group: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      title: true,
      description: true,
      salary: true,
      compensationType: true,
      experienceLevel: true,
      qualification: true,
      responsibilities: true,
      requirements: true,
      applicationType: true,
      locationType: true,
      location: true,
      type: true,
      createdAt: true,
    },
  });

  const total = await prisma.job.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit: take,
    total,
  };

  return { meta, jobs };
};

const getSingleJob = async (id: string, userId: string) => {
  const job = await prisma.job.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          id: true,
          business: {
            select: {
              id: true,
              name: true,
              industry: true,
              address: true,
              image: true,
            },
          },
        },
      },
      group: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const favoriteJob = await prisma.favoriteJob.findFirst({
    where: {
      jobId: id,
      authId: userId,
    },
  });
  return { ...job, isFavorite: favoriteJob ? true : false };
};

const updateJob = async (id: string, userId: string, payload: Partial<Job>) => {
  const job = await prisma.job.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (job.authorId !== userId) throw new ApiError(401, "Unauthorized!");

  if (payload.groupId) {
    await ensureGroupMembership(payload.groupId, userId);
  }

  const result = await prisma.job.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteJob = async (id: string, userId: string) => {
  const job = await prisma.job.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (job.authorId !== userId) throw new ApiError(401, "Unauthorized!");

  const result = await prisma.job.delete({
    where: {
      id,
    },
  });
  return result;
};

export const jobServices = {
  createJob,
  getAllJobs,
  getGroupJobs,
  getSingleJob,
  updateJob,
  deleteJob,
};
