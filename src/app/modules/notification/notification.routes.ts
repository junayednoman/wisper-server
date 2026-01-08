import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { notificationController } from "./notification.controller";
import handleZodValidation from "../../middlewares/handleZodValidation";
import { notificationDeleteValidation } from "./notification.validation";

const router = Router();

router.post(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS, UserRole.ADMIN),
  notificationController.createNotification
);

router.get(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS, UserRole.ADMIN),
  notificationController.getNotifications
);

router.get(
  "/unseen-count",
  authorize(UserRole.PERSON, UserRole.BUSINESS, UserRole.ADMIN),
  notificationController.getUnseenNotificationCount
);

router.patch(
  "/seen",
  authorize(UserRole.PERSON, UserRole.BUSINESS, UserRole.ADMIN),
  handleZodValidation(notificationDeleteValidation),
  notificationController.seenNotifications
);

router.delete(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS, UserRole.ADMIN),
  handleZodValidation(notificationDeleteValidation),
  notificationController.deleteNotifications
);

export const notificationRoutes = router;
