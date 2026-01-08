import { BoostPackageStatus } from "@prisma/client";
import ApiError from "../../middlewares/classes/ApiError";
import prisma from "../../utils/prisma";
import { TPackType } from "./boostPackage.validation";

const createBoostPackage = async (payload: TPackType) => {
  const existing = await prisma.boostPackage.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (existing)
    throw new ApiError(400, "Package already exists with the name!");

  payload.status = BoostPackageStatus.ACTIVE;
  const result = await prisma.boostPackage.create({ data: payload });
  return result;
};

const getPackages = async (query: Record<string, unknown>) => {
  const result = await prisma.boostPackage.findMany({
    where: query.status ? { status: query.status } : {},
  });
  return result;
};

const getSinglePackage = async (packageId: string) => {
  const result = await prisma.boostPackage.findUniqueOrThrow({
    where: {
      id: packageId,
    },
  });
  return result;
};

const updatePackage = async (
  packageId: string,
  payload: Partial<TPackType>
) => {
  const result = await prisma.boostPackage.update({
    where: {
      id: packageId,
    },
    data: payload,
  });
  return result;
};

const deletePackage = async (packageId: string) => {
  const associatedBoosts = await prisma.boost.findFirst({
    where: {
      packageId,
    },
  });

  if (associatedBoosts) {
    throw new ApiError(400, "Boost package is associated with post boosts!");
  }

  const result = await prisma.boostPackage.delete({
    where: {
      id: packageId,
    },
  });
  return result;
};

export const boostPackageService = {
  createBoostPackage,
  getPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
};
