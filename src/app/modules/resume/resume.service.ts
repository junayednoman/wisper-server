import { TFile } from "../../interface/file.interface";
import ApiError from "../../middlewares/classes/ApiError";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import prisma from "../../utils/prisma";

const addResume = async (userId: string, file: TFile) => {
  if (!file) throw new ApiError(400, "File is required!");
  const fileSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

  const url = await uploadToS3(file);
  const resumeData = {
    authorId: userId,
    name: file.originalname,
    fileSize,
    file: url,
  };

  const result = await prisma.resume.create({
    data: resumeData,
  });

  return result;
};

const getMyResumes = async (userId: string) => {
  const result = await prisma.resume.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const changeDefaultResume = async (userId: string, resumeId: string) => {
  const resume = await prisma.resume.findUniqueOrThrow({
    where: {
      id: resumeId,
    },
    select: {
      author: {
        select: {
          id: true,
          person: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (resume.author.id !== userId) throw new ApiError(401, "Unauthorized!");

  const result = await prisma.person.update({
    where: {
      id: resume.author.person!.id,
    },
    data: {
      defaultResumeId: resumeId,
    },
  });

  return result;
};

const deleteResume = async (resumeId: string, userId: string) => {
  const resume = await prisma.resume.findUniqueOrThrow({
    where: {
      id: resumeId,
    },
    select: {
      author: {
        select: {
          id: true,
        },
      },
    },
  });

  if (resume.author.id !== userId) throw new ApiError(401, "Unauthorized!");

  const result = await prisma.resume.delete({
    where: {
      id: resumeId,
    },
  });

  if (result) await deleteFromS3(result.file);

  return result;
};

export const resumeService = {
  addResume,
  getMyResumes,
  changeDefaultResume,
  deleteResume,
};
