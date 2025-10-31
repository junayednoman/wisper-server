import { LoginProvider, UserStatus } from "@prisma/client";
import ApiError from "../../middlewares/classes/ApiError";
import prisma from "../../utils/prisma";
import { sendEmail } from "../../utils/sendEmail";
import {
  TChangePasswordInput,
  TLoginInput,
  TResetPasswordInput,
  TVerifyOtpInput,
} from "./auth.validation";
import bcrypt from "bcrypt";
import jsonwebtoken, { Secret } from "jsonwebtoken";
import config from "../../config";
import generateOTP from "../../utils/generateOTP";
import jwt from "jsonwebtoken";
import { TAuthUser } from "../../interface/global.interface";

const login = async (payload: TLoginInput) => {
  const auth = await prisma.auth.findUniqueOrThrow({
    where: {
      email: payload.email,
      NOT: [
        {
          status: UserStatus.DELETED,
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

const verifyOtp = async (payload: TVerifyOtpInput) => {
  await prisma.auth.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const otp = await prisma.otp.findUniqueOrThrow({
    where: {
      email: payload.email,
      isVerified: false,
    },
  });

  const hasOtpExpired = otp.expires < new Date();

  if (otp.attempts > 3)
    throw new ApiError(400, "Too many attempts! Please request a new one!");

  if (hasOtpExpired) {
    throw new ApiError(400, "OTP expired! Please request a new one!");
  }

  // Update the OTP attempts
  await prisma.otp.update({
    where: {
      email: payload.email,
    },
    data: {
      attempts: {
        increment: 1,
      },
    },
  });

  const hasMatched = await bcrypt.compare(payload.otp, otp.otp);
  if (!hasMatched) {
    throw new ApiError(400, "Invalid OTP! Please try again!");
  }

  const result = await prisma.$transaction(async tn => {
    if (payload.verifyAccount) {
      const updatedAuth = await tn.auth.update({
        where: {
          email: payload.email,
        },
        data: {
          status: UserStatus.ACTIVE,
        },
        include: {
          person: true,
        },
      });

      await prisma.otp.delete({
        where: {
          email: payload.email,
        },
      });

      // send verification success email
      if (updatedAuth) {
        const subject = "🎉 Welcome to wisper-service! Your Email is Verified";
        const name = updatedAuth.person?.name as string;
        const path = "./src/app/emailTemplates/verificationSuccess.html";
        sendEmail(updatedAuth.email, subject, path, { name });
      }
    } else {
      await tn.otp.update({
        where: {
          email: payload.email,
        },
        data: {
          isVerified: true,
        },
      });
    }
  });

  return result;
};

const sendOtp = async (email: string) => {
  const auth = await prisma.auth.findUniqueOrThrow({
    where: {
      email: email,
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

  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  const otpData = {
    email: email,
    otp: hashedOtp,
    expires: otpExpires,
    attempts: 0,
    isVerified: false,
  };

  await prisma.otp.upsert({
    where: {
      email,
    },
    update: otpData,
    create: otpData,
  });

  // send email
  const subject = "Your One-Time Password (OTP) for Password Reset";
  const path = "./src/app/emailTemplates/otp.html";
  sendEmail(email, subject, path, { otp, name: auth.person?.name as string });
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
  const subject = "Your wisper-service Password Has Been Reset 🎉";
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

export const authServices = {
  verifyOtp,
  login,
  sendOtp,
  refreshToken,
  resetPassword,
  changePassword,
  changeAccountStatus,
};
