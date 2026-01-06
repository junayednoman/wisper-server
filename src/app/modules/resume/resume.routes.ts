import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { resumeController } from "./resume.controller";
import { UserRole } from "@prisma/client";
import { upload } from "../../utils/awss3";

const router = Router();

router.post(
  "/",
  authorize(UserRole.PERSON),
  upload.single("file"),
  resumeController.addResume
);

router.get(
  "/:authId",
  authorize(UserRole.PERSON, UserRole.ADMIN),
  resumeController.geUserResumes
);
router.patch(
  "/:id",
  authorize(UserRole.PERSON),
  resumeController.changeDefaultResume
);

router.delete(
  "/:id",
  authorize(UserRole.PERSON),
  resumeController.deleteResume
);

export const resumeRoutes = router;
