import prisma from "../../utils/prisma";
import { months } from "./dashboard.constant";

const getDashboardStats = async () => {
  const totalUsers = await prisma.auth.count({
    where: {
      NOT: {
        role: "ADMIN",
      },
    },
  });
  const totalPersons = await prisma.person.count();
  const totalBusinesses = await prisma.business.count();
  return { totalUsers, totalPersons, totalBusinesses };
};

export const getUserOverview = async (query: Record<string, unknown>) => {
  const currentYear = new Date().getFullYear();
  const { role, year = currentYear } = query;

  const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

  const users = await prisma.auth.findMany({
    where: {
      NOT: { role: "ADMIN" },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      role: role ? role : undefined,
    },
    select: { createdAt: true },
  });

  const monthlyCounts = Array(12).fill(0);

  users.forEach(user => {
    const monthIndex = user.createdAt.getMonth();
    monthlyCounts[monthIndex]++;
  });

  const result = months.map((month, index) => ({
    month,
    users: monthlyCounts[index],
  }));

  return result;
};

export const dashboardServices = {
  getDashboardStats,
  getUserOverview,
};
