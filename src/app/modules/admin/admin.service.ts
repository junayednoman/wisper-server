import { Admin } from "@prisma/client";
import { TFile } from "../../interface/file.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import prisma from "../../utils/prisma";

const getProfile = async (email: string) => {
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      email: email,
    },
  });

  return admin;
};

const updateProfile = async (
  email: string,
  payload: Partial<Admin>,
  file?: TFile
) => {
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      email: email,
    },
  });

  if (file) {
    payload.profileImage = await uploadToS3(file);
  }

  const result = await prisma.admin.update({
    where: {
      email: email,
    },
    data: payload,
  });

  if (result && payload.profileImage && admin.profileImage) {
    await deleteFromS3(admin.profileImage);
  }

  return result;
};

export const adminServices = {
  getProfile,
  updateProfile,
};
