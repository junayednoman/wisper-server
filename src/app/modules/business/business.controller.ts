import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { Response } from "express";
import { businessServices } from "./business.service";

const signUp = handleAsyncRequest(async (req: TRequest, res: Response) => {
  const result = await businessServices.signUp(req.body);
  sendResponse(res, {
    message: "User created successfully!",
    data: result,
    status: 201,
  });
});

export const businessController = {
  signUp,
};
