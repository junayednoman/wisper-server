import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { fileRoutes } from "../modules/uploadFile/uploadFile.routes";
import { otpRoutes } from "../modules/otp/otp.routes";
import { personRoutes } from "../modules/person/person.routes";
import { postRoutes } from "../modules/post/post.routes";
import { reactionRoutes } from "../modules/reaction/reaction.routes";
import { commentRoutes } from "../modules/comment/comment.routes";
import { resumeRoutes } from "../modules/resume/resume.routes";
import { businessRoutes } from "../modules/business/business.routes";
import { jobRoutes } from "../modules/job/job.routes";
import { favoriteRoutes } from "../modules/favorite/favorite.routes";

const router = Router();

const routes = [
  { path: "/auths", route: authRoutes },
  { path: "/otps", route: otpRoutes },
  { path: "/persons", route: personRoutes },
  { path: "/posts", route: postRoutes },
  { path: "/reactions", route: reactionRoutes },
  { path: "/comments", route: commentRoutes },
  { path: "/resumes", route: resumeRoutes },
  { path: "/businesses", route: businessRoutes },
  { path: "/jobs", route: jobRoutes },
  { path: "/favorites", route: favoriteRoutes },

  { path: "/admins", route: adminRoutes },
  { path: "/upload-files", route: fileRoutes },
];

routes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
