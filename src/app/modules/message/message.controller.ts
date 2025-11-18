import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { messageService } from "./message.service";

const sendMessage = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await messageService.sendMessage(req.user!.id, req.body);
  sendResponse(res, {
    message: "Message sent successfully!",
    data: result,
    status: 201,
  });
});

const getMessagesByChat = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);

  const result = await messageService.getMessagesByChat(
    req.user!.id,
    req.params.chatId as string,
    options
  );
  sendResponse(res, {
    message: "Messages retrieved successfully!",
    data: result,
  });
});

const updateMessage = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await messageService.updateMessage(
    req.user!.id,
    req.params.messageId as string,
    req.body
  );
  sendResponse(res, {
    message: "Message updated successfully!",
    data: result,
  });
});

const seenMessages = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await messageService.seenMessages(req.user!.id, req.body);
  sendResponse(res, {
    message: "Messages seen successfully!",
    data: result,
  });
});

export const messageController = {
  sendMessage,
  getMessagesByChat,
  updateMessage,
  seenMessages,
};
