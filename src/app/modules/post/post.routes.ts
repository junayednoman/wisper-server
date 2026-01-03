import { Router } from "express";
import { postController } from "./post.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { upload } from "../../utils/awss3";
import handleZodValidation from "../../middlewares/handleZodValidation";
import { CommentAccessZod, CreatePostZod } from "./post.validation";

const router = Router();

router.post(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  upload.array("images"),
  handleZodValidation(CreatePostZod, { formData: true }),
  postController.create
);
router.get(
  "/feed",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  postController.getFeedPosts
);
router.get(
  "/single/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  postController.getSingle
);
router.get(
  "/all",
  authorize(UserRole.PERSON, UserRole.BUSINESS, UserRole.ADMIN),
  postController.allPosts
);
router.patch(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  upload.array("images"),
  handleZodValidation(CreatePostZod.partial(), { formData: true }),
  postController.update
);
router.patch(
  "/image/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  postController.removeImage
);
router.patch(
  "/comment-access/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(CommentAccessZod),
  postController.updateCommentAccess
);
router.patch(
  "/status/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  postController.changePostStatus
);

router.delete(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  postController.deletePost
);

export const postRoutes = router;
