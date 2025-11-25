import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import handleZodValidation from "../../middlewares/handleZodValidation";
import { legalInfoZod } from "./legal.validation";
import { legalController } from "./legal.controller";

const router = Router();

router.patch(
  "/",
  authorize(UserRole.ADMIN),
  handleZodValidation(legalInfoZod),
  legalController.createOrUpdateLegal
);

router.get(
  "/",
  authorize(UserRole.ADMIN, UserRole.PERSON, UserRole.BUSINESS),
  legalController.getLegalInfo
);

export const legalRoutes = router;
