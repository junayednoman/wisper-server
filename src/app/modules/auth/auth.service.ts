import { LoginProvider, Prisma, UserRole, UserStatus } from "@prisma/client";
import ApiError from "../../middlewares/classes/ApiError";
import prisma from "../../utils/prisma";
import { sendEmail } from "../../utils/sendEmail";
import {
  TChangePasswordInput,
  TLoginInput,
  TResetPasswordInput,
} from "./auth.validation";
import bcrypt from "bcrypt";
import jsonwebtoken, { Secret } from "jsonwebtoken";
import config from "../../config";
import jwt from "jsonwebtoken";
import { TAuthUser } from "../../interface/global.interface";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";

const login = async (payload: TLoginInput) => {
  const auth = await prisma.auth.findUniqueOrThrow({
    where: {
      email: payload.email,
      NOT: [
        {
          status: UserStatus.DELETED,
        },
        {
          status: UserStatus.PENDING,
        },
      ],
    },
  });

  if (auth.status === UserStatus.PENDING)
    throw new ApiError(400, "Please verify your account!");

  if (auth.status === UserStatus.BLOCKED)
    throw new ApiError(400, "Your account is blocked!");

  if (auth.loginProvider === LoginProvider.GOOGLE)
    throw new ApiError(400, "Your account was created using Google!");

  const hasMatched = await bcrypt.compare(payload.password, auth.password);
  if (!hasMatched) throw new ApiError(400, "Invalid credentials!");

  // prepare tokens
  const jwtPayload = {
    email: auth.email,
    role: auth.role,
    id: auth.id,
  };

  const accessToken = jsonwebtoken.sign(
    jwtPayload,
    config.jwt.accessSecret as Secret,
    {
      expiresIn: payload.isMobileApp
        ? config.jwt.refreshExpiration
        : (config.jwt.accessExpiration as any),
    }
  );

  const refreshToken = jsonwebtoken.sign(
    jwtPayload,
    config.jwt.refreshSecret as Secret,
    {
      expiresIn: config.jwt.refreshExpiration as any,
    }
  );

  // update fcmToken if any
  if (payload.fcmToken) {
    await prisma.auth.update({
      where: {
        email: payload.email,
      },
      data: {
        fcmToken: payload.fcmToken,
      },
    });
  }

  return {
    accessToken,
    refreshToken,
  };
};

const getAll = async (options: TPaginationOptions) => {
  const andConditions: Prisma.AuthWhereInput[] = [];

  andConditions.push({
    OR: [
      {
        role: UserRole.PERSON,
      },
      {
        role: UserRole.BUSINESS,
      },
    ],
  });

  const whereConditions: Prisma.AuthWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);
  const personAuths = await prisma.auth.findMany({
    where: whereConditions,
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
    skip,
    take,
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { createdAt: "desc" },
  });

  const total = await prisma.auth.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit: take,
    total,
  };
  return { meta, personAuths };
};

const resetPassword = async (payload: TResetPasswordInput) => {
  const auth = await prisma.auth.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      person: {
        select: {
          name: true,
        },
      },
    },
  });

  const otp = await prisma.otp.findUniqueOrThrow({
    where: {
      email: payload.email,
      isVerified: true,
    },
  });

  if (!otp) throw new ApiError(401, "OTP is not verified!");

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  await prisma.$transaction(async tn => {
    await tn.auth.update({
      where: {
        email: payload.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    await tn.otp.delete({
      where: {
        email: payload.email,
      },
    });
  });

  // send email
  const subject = "Your wisper Password Has Been Reset 🎉";
  const path = "./src/app/emailTemplates/passwordResetSuccess.html";
  const replacements = { name: auth.person?.name as string };
  sendEmail(payload.email, subject, path, replacements);
};

const changePassword = async (
  payload: TChangePasswordInput,
  userId: string
) => {
  const auth = await prisma.auth.findUniqueOrThrow({
    where: {
      id: userId,
      status: UserStatus.ACTIVE,
    },
  });

  const hasMatched = await bcrypt.compare(payload.oldPassword, auth.password);
  if (!hasMatched) {
    throw new ApiError(400, "Old password is incorrect!");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

  await prisma.auth.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};

const changeAccountStatus = async (userId: string, status: UserStatus) => {
  const auth = await prisma.auth.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });
  if (auth.role === UserRole.ADMIN)
    throw new ApiError(400, "Admin account cannot be changed!");

  await prisma.auth.update({
    where: {
      id: userId,
    },
    data: {
      status: status,
    },
  });

  const message =
    status === UserStatus.ACTIVE
      ? "Account activated successfully!"
      : status === "BLOCKED"
        ? "Account blocked successfully!"
        : status === "DELETED"
          ? "Account deleted successfully!"
          : "";
  return { message };
};

const refreshToken = async (token: string) => {
  if (!token) throw new ApiError(401, "Unauthorized!");
  const decodedUser = jwt.verify(token, config.jwt.refreshSecret as Secret);
  if (!decodedUser) throw new ApiError(401, "Unauthorized!");
  const user = await prisma.auth.findUniqueOrThrow({
    where: {
      id: (decodedUser as TAuthUser).id,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user.id,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt.accessSecret as Secret, {
    expiresIn: config.jwt.accessExpiration as any,
  });

  return { accessToken };
};

const toggleNotificationPermission = async (id: string) => {
  const auth = await prisma.auth.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.auth.update({
    where: {
      id,
    },
    data: {
      allowNotifications: !auth.allowNotifications,
    },
    select: {
      id: true,
      allowNotifications: true,
    },
  });
  return result;
};

export const authServices = {
  login,
  getAll,
  refreshToken,
  resetPassword,
  changePassword,
  changeAccountStatus,
  toggleNotificationPermission,
};
