import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { dashboardController } from "./dashboard.controller";

const router = Router();

router.get(
  "/stats",
  authorize(UserRole.ADMIN),
  dashboardController.getDashboardStats
);

router.get(
  "/user-overview",
  authorize(UserRole.ADMIN),
  dashboardController.getUserOverview
);

export const dashboardRoutes = router;
