import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import { Response } from "express";

const getAll = handleAsyncRequest(async (req: TRequest, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await paymentService.getAll(options, req.user!.id);
  sendResponse(res, {
    message: "Payment transactions retrieved successfully!",
    data: result,
  });
});

export const paymentController = { getAll };
