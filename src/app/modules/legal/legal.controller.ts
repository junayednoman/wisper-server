import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { legalService } from "./legal.service";

const createOrUpdateLegal = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await legalService.createOrUpdateLegal(req.body);
  sendResponse(res, {
    message: "Legal info updated successfully!",
    data: result,
  });
});

const getLegalInfo = handleAsyncRequest(async (_req: TRequest, res) => {
  const result = await legalService.getLegalInfo();
  sendResponse(res, {
    message: "Legal info retrieved successfully!",
    data: result,
  });
});

export const legalController = { createOrUpdateLegal, getLegalInfo };
