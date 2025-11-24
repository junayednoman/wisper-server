import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { callController } from "./call.controller";

const router = Router();

router.post(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  callController.createCall
);

router.get(
  "/my",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  callController.getMyCalls
);

export const callRoutes = router;
