import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { recommendationController } from "./recommendation.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  recommendationController.giveRecommendation
);

router.get(
  "/my",
  authorize(UserRole.PERSON),
  recommendationController.getMyRecommendations
);

router.get(
  "/:classId",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  recommendationController.getClassRecommendations
);

export const recommendationRoutes = router;
