import { Router } from "express";
import handleZodValidation from "../../middlewares/handleZodValidation";
import {
  changeAccountStatusZod,
  changePasswordZod,
  loginZodSchema,
  resetPasswordZod,
} from "./auth.validation";
import { authController } from "./auth.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { personController } from "../person/person.controller";
import { personSignupZod } from "../person/person.validation";
import { businessController } from "../business/business.controller";
import { businessSignupZod } from "../business/business.validation";

const router = Router();

router.post(
  "/person/signup",
  handleZodValidation(personSignupZod),
  personController.signUp
);
router.get("/:id", authorize(UserRole.ADMIN), authController.getSingle);
router.get("/", authorize(UserRole.ADMIN), authController.getAll);
router.post(
  "/business/signup",
  handleZodValidation(businessSignupZod),
  businessController.signUp
);

router.post(
  "/login",
  handleZodValidation(loginZodSchema),
  authController.login
);

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

router.patch(
  "/notification-permission",
  authorize(UserRole.PERSON),
  authController.toggleNotificationPermission
);

router.post("/logout", authorize(UserRole.ADMIN), authController.logout);

export const authRoutes = router;
