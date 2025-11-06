import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { businessController } from "./business.controller";
import { UserRole } from "@prisma/client";
import handleZodValidation from "../../middlewares/handleZodValidation";
import { updateBusinessProfileZod } from "./business.validation";
import { upload } from "../../utils/awss3";

const router = Router();

router.get(
  "/profile",
  authorize(UserRole.BUSINESS),
  businessController.getMyProfile
);

router.get(
  "/:id",
  authorize(UserRole.BUSINESS, UserRole.ADMIN, UserRole.PERSON),
  businessController.getSingle
);

router.patch(
  "/profile",
  authorize(UserRole.BUSINESS),
  handleZodValidation(updateBusinessProfileZod),
  businessController.updateMyProfile
);

router.patch(
  "/profile-image",
  authorize(UserRole.BUSINESS),
  upload.single("image"),
  businessController.updateProfileImage
);

export const businessRoutes = router;
