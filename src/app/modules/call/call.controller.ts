import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
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

export const callController = { createCall };
