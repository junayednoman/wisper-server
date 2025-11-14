import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { classController } from "./class.controller";
import handleZodValidation from "../../middlewares/handleZodValidation";
import {
  addClassMemberZod,
  createClassZod,
  updateClassDataZod,
} from "./class.validation";
import { upload } from "../../utils/awss3";

const router = Router();

router.post(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(createClassZod),
  classController.createClass
);

router.get(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  classController.getSingleClass
);

router.post(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(addClassMemberZod),
  classController.addClassMember
);

router.patch(
  "/image/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  upload.single("image"),
  classController.changeClassImage
);

router.patch(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(updateClassDataZod),
  classController.updateClassData
);

router.patch(
  "/visibility/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  classController.toggleClassVisibility
);

router.patch(
  "/invitation-access/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  classController.toggleClassInvitationAccess
);

export const classRoutes = router;
