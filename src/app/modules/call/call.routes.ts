import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { callController } from "./call.controller";
import handleZodValidation from "../../middlewares/handleZodValidation";
import { callTokenZod, callZod } from "./call.validation";

const router = Router();

router.post(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(callZod),
  callController.createCall
);

router.get(
  "/my",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  callController.getMyCalls
);

router.post(
  "/token",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(callTokenZod),
  callController.generateToken
);

router.patch(
  "/:id/end",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  callController.endCall
);

export const callRoutes = router;
