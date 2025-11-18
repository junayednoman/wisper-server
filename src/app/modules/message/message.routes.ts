import { Router } from "express";
import { messageController } from "./message.controller";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import handleZodValidation from "../../middlewares/handleZodValidation";
import { seenMessagesZod, sendMessageZod } from "./message.validation";

const router = Router();

router.post(
  "/send",
  authorize(UserRole.BUSINESS, UserRole.PERSON),
  handleZodValidation(sendMessageZod),
  messageController.sendMessage
);

router.get(
  "/:chatId",
  authorize(UserRole.BUSINESS, UserRole.PERSON),
  messageController.getMessagesByChat
);

router.patch(
  "/seen",
  authorize(UserRole.BUSINESS, UserRole.PERSON),
  handleZodValidation(seenMessagesZod),
  messageController.seenMessages
);

router.patch(
  "/:messageId",
  authorize(UserRole.BUSINESS, UserRole.PERSON),
  handleZodValidation(sendMessageZod.partial()),
  messageController.updateMessage
);

export const messageRoutes = router;
