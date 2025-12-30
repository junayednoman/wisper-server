import { Job, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";
import { jobFilterableFields, jobSearchableFields } from "./job.constant";
import ApiError from "../../middlewares/classes/ApiError";

const createJob = async (userId: string, payload: Job) => {
  payload.authorId = userId;

  const result = await prisma.job.create({ data: payload });
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

const getSingleJob = async (id: string) => {
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
    },
  });

  const favoriteJob = await prisma.favoriteJob.findFirst({
    where: {
      jobId: id,
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
  getSingleJob,
  updateJob,
  deleteJob,
};
