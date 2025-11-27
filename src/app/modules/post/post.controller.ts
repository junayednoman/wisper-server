import { TFile } from "../../interface/file.interface";
import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { PostService } from "./post.service";

const create = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await PostService.create(
    req.user!.id,
    req.body,
    req.files as TFile[]
  );
  sendResponse(res, {
    message: "Post created successfully!",
    data: result,
    status: 201,
  });
});

const getFeedPosts = handleAsyncRequest(async (_req: TRequest, res) => {
  const result = await PostService.getFeedPosts();
  sendResponse(res, {
    message: "Posts retrieved successfully!",
    data: result,
  });
});

const getSingle = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await PostService.getSingle(req.params.id as string);
  sendResponse(res, {
    message: "Post retrieved successfully!",
    data: result,
  });
});

const myPosts = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await PostService.userPosts(req.user!.id, options, req.query);
  sendResponse(res, {
    message: "Posts retrieved successfully!",
    data: result,
  });
});

const userPosts = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await PostService.userPosts(
    req.params.userId as string,
    options
  );
  sendResponse(res, {
    message: "Posts retrieved successfully!",
    data: result,
  });
});

const update = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await PostService.update(
    req.user!.id,
    req.params.id as string,
    req.body,
    req.files as TFile[] | undefined
  );
  sendResponse(res, {
    message: "Post updated successfully!",
    data: result,
  });
});

const removeImage = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await PostService.removeImage(
    req.user!.id,
    req.params.id as string,
    req.body.url
  );
  sendResponse(res, {
    message: "Post image deleted successfully!",
    data: result,
  });
});

const updateCommentAccess = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await PostService.updateCommentAccess(
    req.user!.id,
    req.params.id as string,
    req.body.commentAccess
  );
  sendResponse(res, {
    message: "Post comment access updated successfully!",
    data: result,
  });
});

const changePostStatus = handleAsyncRequest(async (req: TRequest, res) => {
  const { result, message } = await PostService.changePostStatus(
    req.user!.id,
    req.params.id as string,
    req.body.status
  );
  sendResponse(res, {
    message,
    data: result,
  });
});

export const postController = {
  create,
  getFeedPosts,
  getSingle,
  myPosts,
  userPosts,
  update,
  removeImage,
  updateCommentAccess,
  changePostStatus,
};
