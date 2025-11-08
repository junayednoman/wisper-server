import { Recommendation, UserRole } from "@prisma/client";
import prisma from "../../utils/prisma";

const giveRecommendation = async (payload: Recommendation, authId: string) => {
  if (payload.receiverId) {
    await prisma.auth.findUniqueOrThrow({
      where: {
        id: payload.receiverId,
        role: UserRole.PERSON,
      },
    });
  } else if (payload.classReceiverId) {
    await prisma.class.findUniqueOrThrow({
      where: {
        id: payload.classReceiverId,
      },
    });
  }
  payload.giverId = authId;

  const result = await prisma.recommendation.create({ data: payload });
  return result;
};

const getMyRecommendations = async (authId: string) => {
  const result = await prisma.recommendation.findMany({
    where: {
      receiverId: authId,
    },
    select: {
      id: true,
      rating: true,
      text: true,
      giver: {
        select: {
          id: true,
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
  });
  return result;
};

const getClassRecommendations = async (classId: string) => {
  const result = await prisma.recommendation.findMany({
    where: {
      classReceiverId: classId,
    },
    select: {
      id: true,
      rating: true,
      text: true,
      giver: {
        select: {
          id: true,
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
  });
  return result;
};

export const recommendationService = {
  giveRecommendation,
  getMyRecommendations,
  getClassRecommendations,
};
