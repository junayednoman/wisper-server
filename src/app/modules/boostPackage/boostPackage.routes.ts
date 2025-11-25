import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import handleZodValidation from "../../middlewares/handleZodValidation";
import { packZod } from "./boostPackage.validation";
import { boostPackageController } from "./boostPackage.controller";

const router = Router();

router.post(
  "/",
  authorize(UserRole.ADMIN),
  handleZodValidation(packZod),
  boostPackageController.createBoostPackage
);

router.get("/", authorize(UserRole.ADMIN), boostPackageController.getPackages);

router.get(
  "/:id",
  authorize(UserRole.ADMIN),
  boostPackageController.getSinglePackage
);

router.patch(
  "/:id",
  authorize(UserRole.ADMIN),
  handleZodValidation(packZod.partial()),
  boostPackageController.updatePackage
);

router.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  boostPackageController.deletePackage
);

export const boostPackageRoutes = router;
