import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { favoriteJobController } from "./favorite.controller";

const router = Router();

router.post(
  "/:jobId",
  authorize(UserRole.PERSON),
  favoriteJobController.addOrRemoveFavoriteJob
);
router.get(
  "/",
  authorize(UserRole.PERSON),
  favoriteJobController.myFavoriteList
);

export const favoriteRoutes = router;
