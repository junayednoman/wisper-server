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
router.get(
  "/",
  authorize(UserRole.BUSINESS, UserRole.PERSON, UserRole.ADMIN),
  jobController.getAllJobs
);
router.patch(
  "/:id",
  authorize(UserRole.BUSINESS),
  handleZodValidation(createJobSchema.partial()),
  jobController.updateJob
);
router.delete("/:id", authorize(UserRole.BUSINESS), jobController.deleteJob);

export const jobRoutes = router;
