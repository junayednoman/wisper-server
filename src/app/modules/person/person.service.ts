import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPersonSignUp } from "./person.validation";
import ApiError from "../../middlewares/classes/ApiError";
import bcrypt from "bcrypt";
import generateOTP from "../../utils/generateOTP";
import { sendEmail } from "../../utils/sendEmail";

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

export const personServices = {
  signUp,
};
