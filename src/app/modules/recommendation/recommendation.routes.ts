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
  "/:personId",
  authorize(UserRole.PERSON, UserRole.ADMIN),
  recommendationController.getRecommendationsByPersonId
);

router.get(
  "/:classId",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  recommendationController.getClassRecommendations
);

export const recommendationRoutes = router;
