import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { chatService } from "./chat.service";

const createChat = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chatService.createChat(req.user!.id, req.body);
  sendResponse(res, {
    message: "Chat created successfully!",
    data: result,
    status: 201,
  });
});

const getMyChats = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await chatService.getMyChats(req.user!.id, options, req.query);
  sendResponse(res, {
    message: "Chats retrieved successfully!",
    data: result,
  });
});

const getChatLinks = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chatService.getChatLinks(
    req.user!.id,
    req.params.id as string
  );
  sendResponse(res, {
    message: "Chat links retrieved successfully!",
    data: result,
  });
});

const getChatFiles = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chatService.getChatFiles(
    req.user!.id,
    req.params.id as string,
    req.query as any
  );
  sendResponse(res, {
    message: "Chat files retrieved successfully!",
    data: result,
  });
});

const muteChat = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chatService.muteChat(req.user!.id, req.body);
  sendResponse(res, {
    message: "Chat muted successfully!",
    data: result,
  });
});

const unmuteChat = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chatService.unmuteChat(
    req.user!.id,
    req.params.chatId as string
  );
  sendResponse(res, {
    message: "Chat unmuted successfully!",
    data: result,
  });
});

const removeParticipant = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chatService.removeParticipant(req.user!.id, req.body);
  sendResponse(res, {
    message: "Chat participant removed successfully!",
    data: result,
  });
});

const blockChatParticipant = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chatService.blockChatParticipant(req.user!.id, req.body);
  sendResponse(res, {
    message: "Chat participant blocked successfully!",
    data: result,
  });
});

const unBlockChatParticipant = handleAsyncRequest(
  async (req: TRequest, res) => {
    const result = await chatService.unBlockChatParticipant(
      req.user!.id,
      req.body
    );
    sendResponse(res, {
      message: "Chat participant unblocked successfully!",
      data: result,
    });
  }
);

const deleteChat = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await chatService.deleteChat(
    req.user!.id,
    req.params.chatId as string
  );
  sendResponse(res, {
    message: "Chat deleted successfully!",
    data: result,
  });
});

export const chatController = {
  createChat,
  getMyChats,
  getChatLinks,
  getChatFiles,
  muteChat,
  unmuteChat,
  removeParticipant,
  blockChatParticipant,
  unBlockChatParticipant,
  deleteChat,
};
