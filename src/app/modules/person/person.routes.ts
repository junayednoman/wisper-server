import { Router } from "express";
import { personController } from "./person.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import handleZodValidation from "../../middlewares/handleZodValidation";
import { updatePersonProfileZod } from "./person.validation";
import { upload } from "../../utils/awss3";

const router = Router();

router.get(
  "/profile",
  authorize(UserRole.PERSON),
  personController.getMyProfile
);
router.get(
  "/:id",
  authorize(UserRole.ADMIN, UserRole.PERSON, UserRole.BUSINESS),
  personController.getSingle
);
router.patch(
  "/profile",
  authorize(UserRole.PERSON),
  handleZodValidation(updatePersonProfileZod),
  personController.updateMyProfile
);
router.patch(
  "/profile-image",
  authorize(UserRole.PERSON),
  upload.single("image"),
  personController.updateProfileImage
);

export const personRoutes = router;
