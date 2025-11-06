import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { jobController } from "./job.controller";
import handleZodValidation from "../../middlewares/handleZodValidation";
import { createJobSchema } from "./job.validation";

const router = Router();

router.post(
  "/",
  authorize(UserRole.BUSINESS),
  handleZodValidation(createJobSchema),
  jobController.createJob
);

export const jobRoutes = router;
