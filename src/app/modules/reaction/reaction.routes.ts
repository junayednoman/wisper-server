import { Router } from "express";
import { reactionController } from "./reaction.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/:postId",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  reactionController.addRemoveReaction
);
router.get(
  "/:postId",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  reactionController.getPostReactions
);

export const reactionRoutes = router;
