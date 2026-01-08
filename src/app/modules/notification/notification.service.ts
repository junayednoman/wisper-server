import { Prisma } from "@prisma/client";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";
import prisma from "../../utils/prisma";

const createNotification = async (userId: string) => {
  const payload = {
    receiverId: userId,
    title: "New Feature Released",
    body: "Check out the new feature in our app now!",
  };

  const result = await prisma.notification.create({ data: payload });
  return result;
};

const getNotifications = async (
  userId: string,
  options: TPaginationOptions
) => {
  const andConditions: Prisma.NotificationWhereInput[] = [];

  andConditions.push({
    receiverId: userId,
  });

  const whereConditions: Prisma.NotificationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);
  const notifications = await prisma.notification.findMany({
    where: whereConditions,
    skip,
    take,
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { date: "desc" },
  });

  const total = await prisma.notification.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit: take,
    total,
  };

  return { meta, notifications };
};

const getUnseenNotificationCount = async (userId: string) => {
  const result = await prisma.notification.count({
    where: {
      receiverId: userId,
      hasSeen: false,
    },
  });
  return result;
};

const seenNotifications = async (userId: string, ids: string[]) => {
  const result = await prisma.notification.updateMany({
    where: {
      receiverId: userId,
      id: {
        in: ids,
      },
    },
    data: {
      hasSeen: true,
    },
  });
  return result;
};

const deleteNotifications = async (userId: string, ids: string[]) => {
  const result = await prisma.notification.deleteMany({
    where: {
      receiverId: userId,
      id: {
        in: ids,
      },
    },
  });
  return result;
};

export const notificationService = {
  createNotification,
  getNotifications,
  getUnseenNotificationCount,
  seenNotifications,
  deleteNotifications,
};
