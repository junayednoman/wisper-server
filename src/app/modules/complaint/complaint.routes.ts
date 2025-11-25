import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { complaintController } from "./complaint.controller";
import { UserRole } from "@prisma/client";
import handleZodValidation from "../../middlewares/handleZodValidation";
import { changeComplaintStatusZod, complaintZod } from "./complaint.validation";

const router = Router();

router.post(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(complaintZod),
  complaintController.createComplaint
);

router.get(
  "/",
  authorize(UserRole.ADMIN),
  complaintController.getAllComplaints
);

router.patch(
  "/status/:id",
  authorize(UserRole.ADMIN),
  handleZodValidation(changeComplaintStatusZod),
  complaintController.changeComplaintStatus
);

export const complaintRoutes = router;
