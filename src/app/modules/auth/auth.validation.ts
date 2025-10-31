import z from "zod";
import { passwordZod } from "../../validation/global.validation";
import { UserStatus } from "@prisma/client";

export const verifyOtpZod = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  otp: z
    .string()
    .min(6, "OTP must be at least 6 characters long")
    .max(6, "OTP must be at most 6 characters long"),
  verifyAccount: z.boolean().optional(),
});

export type TVerifyOtpInput = z.infer<typeof verifyOtpZod>;

export const loginZodSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required").trim(),
  fcmToken: z.string().optional(),
  isMobileApp: z.boolean().default(false),
});

export type TLoginInput = z.infer<typeof loginZodSchema>;

export const resetPasswordZod = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: passwordZod,
});

export type TResetPasswordInput = z.infer<typeof resetPasswordZod>;

export const changePasswordZod = z.object({
  oldPassword: z.string().min(1, "Old password is required").trim(),
  newPassword: passwordZod,
});

export type TChangePasswordInput = z.infer<typeof changePasswordZod>;

export const changeAccountStatusZod = z.object({
  status: z
    .enum([UserStatus.ACTIVE, UserStatus.DELETED, UserStatus.BLOCKED])
    .default("ACTIVE")
    .transform(val => val.toUpperCase()),
});
