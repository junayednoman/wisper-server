import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { ReactionService } from "./reaction.service";

const addRemoveReaction = handleAsyncRequest(async (req: TRequest, res) => {
  const { result, message } = await ReactionService.addRemoveReaction(
    req.params.postId as string,
    req.user!.id
  );
  sendResponse(res, {
    message,
    data: result,
  });
});

const getPostReactions = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await ReactionService.getPostReactions(
    req.params.postId as string
  );
  sendResponse(res, {
    message: "Reactions retrieved successfully!",
    data: result,
  });
});

export const reactionController = {
  addRemoveReaction,
  getPostReactions,
};
