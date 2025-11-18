import { Router } from "express";
import authorize from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import { chatController } from "./chat.controller";
import handleZodValidation from "../../middlewares/handleZodValidation";
import {
  blockParticipantZod,
  createChatZod,
  muteChatZod,
  removeParticipantZod,
} from "./chat.validation";

const router = Router();

router.post(
  "/",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(createChatZod),
  chatController.createChat
);

router.get(
  "/my",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  chatController.getMyChats
);

router.patch(
  "/mute",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(muteChatZod),
  chatController.muteChat
);

router.patch(
  "/unmute/:chatId",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  chatController.unmuteChat
);

router.patch(
  "/remove-participant",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(removeParticipantZod),
  chatController.removeParticipant
);

router.patch(
  "/block-participant",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(blockParticipantZod),
  chatController.blockChatParticipant
);

router.patch(
  "/unblock-participant",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  handleZodValidation(blockParticipantZod),
  chatController.unBlockChatParticipant
);

router.delete(
  "/:chatId",
  authorize(UserRole.PERSON, UserRole.BUSINESS),
  chatController.deleteChat
);

export const chatRoutes = router;
