import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { callService } from "./call.service";

const createCall = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await callService.createCall(req.user!.id, req.body);
  sendResponse(res, {
    message: "Call created successfully!",
    data: result,
    status: 201,
  });
});

const getMyCalls = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await callService.getMyCalls(req.user!.id, options, req.query);
  sendResponse(res, {
    message: "Calls retrieved successfully!",
    data: result,
  });
});

const generateToken = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await callService.generateCallToken(req.user!.id, req.body);
  sendResponse(res, {
    message: "Token generated successfully!",
    data: result,
  });
});

const endCall = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await callService.endCall(
    req.user!.id,
    req.params.id as string
  );
  sendResponse(res, {
    message: "Call ended successfully!",
    data: result,
  });
});

export const callController = {
  createCall,
  getMyCalls,
  generateToken,
  endCall,
};
