import { UserRole } from "@prisma/client";
import { Router } from "express";
import { paymentController } from "./payment.controller";
import authorize from "../../middlewares/authorize";

const router = Router();

router.get(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  paymentController.getAll
);

export const paymentRoutes = router;
