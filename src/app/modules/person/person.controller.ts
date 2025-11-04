import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { Response } from "express";
import { personServices } from "./person.service";

const signUp = handleAsyncRequest(async (req: TRequest, res: Response) => {
  const result = await personServices.signUp(req.body);
  sendResponse(res, {
    message: "User created successfully!",
    data: result,
    status: 201,
  });
});

export const personController = {
  signUp,
};
