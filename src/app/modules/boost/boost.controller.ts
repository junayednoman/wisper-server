import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { boostServices } from "./boost.service";

const createPaymentSession = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await boostServices.createPaymentSession(
    req.user!.id,
    req.body
  );
  sendResponse(res, {
    message: "Payment session created successfully!",
    data: result,
    status: 201,
  });
});

const paymentCallback = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await boostServices.paymentCallback(req.query);
  sendResponse(res, {
    message: "Payment Success!",
    data: result,
  });
});

export const boostController = {
  createPaymentSession,
  paymentCallback,
};
