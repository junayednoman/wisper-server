import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { groupController } from "./group.controller";
import handleZodValidation from "../../middlewares/handleZodValidation";
import {
  addGroupMemberZod,
  createGroupZod,
  updateGroupDataZod,
} from "./group.validation";
import { upload } from "../../utils/awss3";

const router = Router();

router.post(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(createGroupZod),
  groupController.createGroup
);

router.get(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  groupController.getSingleGroup
);

router.post(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(addGroupMemberZod),
  groupController.addGroupMember
);

router.patch(
  "/image/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  upload.single("image"),
  groupController.changeGroupImage
);

router.patch(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(updateGroupDataZod),
  groupController.updateGroupData
);

router.patch(
  "/visibility/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  groupController.toggleGroupVisibility
);

router.patch(
  "/invitation-access/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  groupController.toggleGroupInvitationAccess
);

export const groupRoutes = router;
