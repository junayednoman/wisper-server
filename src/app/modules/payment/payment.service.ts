import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";
import prisma from "../../utils/prisma";

const getAll = async (options: TPaginationOptions, userId: string) => {
  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);
  const payments = await prisma.payment.findMany({
    where: { authId: userId },
    select: {
      id: true,
      amount: true,
      date: true,
      transactionId: true,
      auth: {
        select: {
          id: true,
          person: {
            select: {
              name: true,
              image: true,
            },
          },
          business: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
    skip,
    take,
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { date: "desc" },
  });

  const total = await prisma.payment.count({
    where: { authId: userId },
  });

  const meta = {
    page,
    limit: take,
    total,
  };
  return { meta, payments };
};

export const paymentService = { getAll };
