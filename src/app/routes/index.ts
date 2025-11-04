import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { fileRoutes } from "../modules/uploadFile/uploadFile.routes";
import { otpRoutes } from "../modules/otp/otp.routes";

const router = Router();

const routes = [
  { path: "/auths", route: authRoutes },
  { path: "/otps", route: otpRoutes },

  { path: "/admins", route: adminRoutes },
  { path: "/upload-files", route: fileRoutes },
];

routes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
