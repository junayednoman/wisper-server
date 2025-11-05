import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { CommentService } from "./comment.service";

const addComment = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await CommentService.addComment(
    req.user!.id,
    req.params.postId as string,
    req.body
  );
  sendResponse(res, {
    message: "Comment added successfully!",
    data: result,
    status: 201,
  });
});

const getAll = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await CommentService.getAll(
    req.params.postId as string,
    options
  );
  sendResponse(res, {
    message: "Comments retrieved successfully!",
    data: result,
  });
});

const editComment = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await CommentService.editComment(
    req.params.id as string,
    req.user!.id,
    req.body.text
  );
  sendResponse(res, {
    message: "Comment updated successfully!",
    data: result,
  });
});

const deleteComment = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await CommentService.deleteComment(
    req.params.id as string,
    req.user!.id
  );
  sendResponse(res, {
    message: "Comment deleted successfully!",
    data: result,
  });
});

export const commentController = {
  addComment,
  getAll,
  editComment,
  deleteComment,
};
