import { UserRole, UserStatus } from "@prisma/client";
import generateOTP from "../../utils/generateOTP";
import prisma from "../../utils/prisma";
import { sendEmail } from "../../utils/sendEmail";
import ApiError from "../../middlewares/classes/ApiError";
import bcrypt from "bcrypt";
import { TVerifyOtpInput } from "./otp.validation";

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
          business: true,
        },
      });

      await prisma.otp.delete({
        where: {
          email: payload.email,
        },
      });

      // send verification success email
      if (updatedAuth) {
        const subject = "Welcome to Wisper! Your Email is Verified";
        let name = "";
        if (updatedAuth.role === UserRole.PERSON) {
          name = updatedAuth.person?.name as string;
        } else if (updatedAuth.role === UserRole.BUSINESS) {
          name = updatedAuth.business?.name as string;
        }
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
  const subject = "Your One-Time Password (OTP)";
  const path = "./src/app/emailTemplates/otp.html";
  sendEmail(email, subject, path, { otp, name: auth.person?.name as string });
};

export const otpServices = {
  verifyOtp,
  sendOtp,
};
