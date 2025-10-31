import { Router } from "express";
import handleZodValidation from "../../middlewares/handleZodValidation";
import {
  changeAccountStatusZod,
  changePasswordZod,
  loginZodSchema,
  resetPasswordZod,
  verifyOtpZod,
} from "./auth.validation";
import { authController } from "./auth.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/login",
  handleZodValidation(loginZodSchema),
  authController.login
);

router.post(
  "/verify-otp",
  handleZodValidation(verifyOtpZod),
  authController.verifyOtp
);

router.post("/send-otp", authController.sendOtp);

router.post(
  "/reset-password",
  handleZodValidation(resetPasswordZod),
  authController.resetPassword
);

router.post(
  "/change-password",
  authorize(UserRole.ADMIN, UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(changePasswordZod),
  authController.changePassword
);

router.patch(
  "/change-account-status/:userId",
  authorize(UserRole.ADMIN),
  handleZodValidation(changeAccountStatusZod),
  authController.changeAccountStatus
);

router.get("/refresh-token", authController.refreshToken);

export const authRoutes = router;
