import prisma from "../../utils/prisma";

const addOrRemoveFavoriteJob = async (authId: string, jobId: string) => {
  await prisma.job.findUniqueOrThrow({ where: { id: jobId } });
  const existingFavorite = await prisma.favoriteJob.findFirst({
    where: {
      jobId,
      authId,
    },
  });

  if (existingFavorite) {
    const result = await prisma.favoriteJob.delete({
      where: {
        id: existingFavorite.id,
      },
    });
    const message = "Job removed from favorite list successfully!";
    return { result, message };
  } else {
    const result = await prisma.favoriteJob.create({
      data: { jobId, authId },
    });
    const message = "Job added to favorite successfully!";
    return { result, message };
  }
};

const myFavoriteList = async (authId: string) => {
  console.log("userId, ", authId);
  const result = await prisma.favoriteJob.findMany({
    where: {
      authId,
    },
    include: {
      job: {
        include: {
          author: {
            select: {
              id: true,
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
      },
    },
  });
  return result;
};

export const favoriteJobService = {
  addOrRemoveFavoriteJob,
  myFavoriteList,
};
