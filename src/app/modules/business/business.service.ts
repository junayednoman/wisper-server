import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TBusinessSignup, TUpdateBusinessProfile } from "./business.validation";
import ApiError from "../../middlewares/classes/ApiError";
import bcrypt from "bcrypt";
import generateOTP from "../../utils/generateOTP";
import { sendEmail } from "../../utils/sendEmail";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import { TFile } from "../../interface/file.interface";

const signUp = async (payload: TBusinessSignup) => {
  const existingUser = await prisma.auth.findUnique({
    where: {
      email: payload.business.email,
      OR: [
        { status: UserStatus.ACTIVE },
        { status: UserStatus.BLOCKED },
        { status: UserStatus.DELETED },
      ],
    },
  });

  if (existingUser) throw new ApiError(400, "User already exists!");

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const authData = {
    email: payload.business.email,
    password: hashedPassword,
    role: UserRole.BUSINESS,
  };

  const otp = generateOTP();

  const result = await prisma.$transaction(async tn => {
    await tn.auth.upsert({
      where: {
        email: payload.business.email,
      },
      create: authData,
      update: authData,
    });

    const result = await tn.business.upsert({
      where: {
        email: payload.business.email,
      },
      create: payload.business,
      update: payload.business,
    });

    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

    const otpData = {
      email: payload.business.email,
      otp: hashedOtp,
      expires: otpExpires,
      attempts: 0,
    };

    await tn.otp.upsert({
      where: {
        email: payload.business.email,
      },
      update: otpData,
      create: otpData,
    });
    return result;
  });

  // sendEmail
  if (result) {
    const subject = "Complete your signup – verify your email";
    const replacements = {
      name: payload.business.name,
      otp,
    };
    const path = "./src/app/emailTemplates/welcome.html";
    sendEmail(payload.business.email, subject, path, replacements);
  }

  return result;
};

const getSingle = async (id: string, currentAuthId: string) => {
  const result = await prisma.auth.findUnique({
    where: {
      id: id,
      role: UserRole.BUSINESS,
    },
    select: {
      id: true,
      createdAt: true,
      business: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
          industry: true,
          address: true,
        },
      },
    },
  });

  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        {
          requesterId: currentAuthId,
          receiverId: id,
        },
        {
          requesterId: id,
          receiverId: currentAuthId,
        },
      ],
    },
  });

  return {
    auth: result,
    connection,
  };
};

const getMyProfile = async (id: string) => {
  const result = await prisma.auth.findUnique({
    where: {
      id: id,
      role: UserRole.BUSINESS,
    },
    select: {
      id: true,
      role: true,
      createdAt: true,
      business: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
          industry: true,
          address: true,
        },
      },
    },
  });

  const recommendations = await prisma.recommendation.findMany({
    where: {
      receiverId: id,
    },
    select: {
      id: true,
      receiver: {
        select: {
          business: {
            select: {
              image: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return { auth: result, recommendations };
};

const updateMyProfile = async (
  email: string,
  payload: TUpdateBusinessProfile
) => {
  const result = await prisma.business.update({
    where: {
      email,
    },
    data: payload,
  });

  return result;
};

const updateProfileImage = async (email: string, file: TFile) => {
  if (!file) throw new Error("No file provided!");
  const business = await prisma.business.findUnique({
    where: {
      email,
    },
  });
  const image = await uploadToS3(file);
  const result = await prisma.business.update({
    where: {
      email,
    },
    data: {
      image,
    },
  });
  if (result && business?.image) await deleteFromS3(business.image);
  return result;
};

export const businessServices = {
  signUp,
  getSingle,
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
};
