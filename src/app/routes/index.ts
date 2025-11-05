import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { fileRoutes } from "../modules/uploadFile/uploadFile.routes";
import { otpRoutes } from "../modules/otp/otp.routes";
import { personRoutes } from "../modules/person/person.routes";
import { postRoutes } from "../modules/post/post.routes";
import { reactionRoutes } from "../modules/reaction/reaction.routes";

const router = Router();

const routes = [
  { path: "/auths", route: authRoutes },
  { path: "/otps", route: otpRoutes },
  { path: "/persons", route: personRoutes },
  { path: "/posts", route: postRoutes },
  { path: "/reactions", route: reactionRoutes },

  { path: "/admins", route: adminRoutes },
  { path: "/upload-files", route: fileRoutes },
];

routes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
