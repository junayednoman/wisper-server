import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPersonSignUp, TUpdatePersonProfile } from "./person.validation";
import ApiError from "../../middlewares/classes/ApiError";
import bcrypt from "bcrypt";
import generateOTP from "../../utils/generateOTP";
import { sendEmail } from "../../utils/sendEmail";
import { TFile } from "../../interface/file.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";

const signUp = async (payload: TPersonSignUp) => {
  const existingUser = await prisma.auth.findUnique({
    where: {
      email: payload.person.email,
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
    email: payload.person.email,
    password: hashedPassword,
    role: UserRole.PERSON,
  };

  const otp = generateOTP();

  const result = await prisma.$transaction(async tn => {
    await tn.auth.upsert({
      where: {
        email: payload.person.email,
      },
      create: authData,
      update: authData,
    });

    const result = await tn.person.upsert({
      where: {
        email: payload.person.email,
      },
      create: payload.person,
      update: payload.person,
    });

    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    const otpExpires = new Date(Date.now() + 3 * 60 * 1000);

    const otpData = {
      email: payload.person.email,
      otp: hashedOtp,
      expires: otpExpires,
      attempts: 0,
    };

    await tn.otp.upsert({
      where: {
        email: payload.person.email,
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
      name: payload.person.name,
      otp,
    };
    const path = "./src/app/emailTemplates/welcome.html";
    sendEmail(payload.person.email, subject, path, replacements);
  }

  return result;
};

const getSingle = async (id: string) => {
  const result = await prisma.auth.findUnique({
    where: {
      id: id,
      role: UserRole.PERSON,
    },
    select: {
      id: true,
      createdAt: true,
      person: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
          title: true,
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
          person: {
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

const getMyProfile = async (id: string) => {
  const result = await prisma.auth.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      role: true,
      createdAt: true,
      person: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
          title: true,
          industry: true,
          defaultResume: {
            select: {
              name: true,
              file: true,
              fileSize: true,
              createdAt: true,
            },
          },
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
          person: {
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
  payload: TUpdatePersonProfile
) => {
  const result = await prisma.person.update({
    where: {
      email,
    },
    data: payload,
  });

  return result;
};

const updateProfileImage = async (email: string, file: TFile) => {
  if (!file) throw new Error("No file provided!");
  const person = await prisma.person.findUnique({
    where: {
      email,
    },
  });
  const image = await uploadToS3(file);
  console.log("image, ", image);
  const result = await prisma.person.update({
    where: {
      email,
    },
    data: {
      image,
    },
  });
  if (result && person?.image) await deleteFromS3(person.image);
  return result;
};

const getUserRoles = async (options: TPaginationOptions) => {
  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);
  const roles = await prisma.auth.findMany({
    where: {
      role: UserRole.PERSON,
    },
    select: {
      id: true,
      person: {
        select: {
          name: true,
          image: true,
          title: true,
        },
      },
      _count: {
        select: {
          posts: true,
          receivedRecommendations: true,
        },
      },
    },
    skip,
    take,
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { createdAt: "desc" },
  });

  const total = await prisma.auth.count({
    where: {
      role: UserRole.PERSON,
    },
  });

  const meta = {
    page,
    limit: take,
    total,
  };
  return { meta, roles };
};

export const personServices = {
  signUp,
  getSingle,
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
  getUserRoles,
};
