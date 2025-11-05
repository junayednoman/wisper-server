import { Router } from "express";
import { commentController } from "./comment.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import handleZodValidation from "../../middlewares/handleZodValidation";
import { AddCommentZod } from "./comment.validation";

const router = Router();

router.post(
  "/:postId",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(AddCommentZod),
  commentController.addComment
);

router.get(
  "/:postId",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  commentController.getAll
);

router.patch(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(AddCommentZod),
  commentController.editComment
);

router.delete(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  commentController.deleteComment
);

export const commentRoutes = router;
