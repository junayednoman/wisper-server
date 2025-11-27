import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { boostController } from "./boost.controller";

const router = Router();

router.post(
  "/checkout-session",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  boostController.createPaymentSession
);

router.get("/callback", boostController.paymentCallback);

export const boostRoutes = router;
