import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { connectionController } from "./connection.controller";
import handleZodValidation from "../../middlewares/handleZodValidation";
import {
  acceptConnectionRequestZod,
  connectionRequestZod,
} from "./connection.validation";

const router = Router();

router.post(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(connectionRequestZod),
  connectionController.sendConnectionRequest
);

router.get(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  connectionController.getMyConnections
);

router.patch(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(acceptConnectionRequestZod),
  connectionController.acceptOrRejectConnection
);

router.delete(
  "/:id",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  connectionController.deleteConnection
);

export const connectionRoutes = router;
