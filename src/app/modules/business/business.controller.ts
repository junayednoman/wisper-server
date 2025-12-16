import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { Response } from "express";
import { businessServices } from "./business.service";
import { TFile } from "../../interface/file.interface";

const signUp = handleAsyncRequest(async (req: TRequest, res: Response) => {
  const result = await businessServices.signUp(req.body);
  sendResponse(res, {
    message: "User created successfully!",
    data: result,
    status: 201,
  });
});

const getMyProfile = handleAsyncRequest(
  async (req: TRequest, res: Response) => {
    const result = await businessServices.getMyProfile(req.user!.id);
    sendResponse(res, {
      message: "User profile retrieved successfully!",
      data: result,
    });
  }
);

const getSingle = handleAsyncRequest(async (req: TRequest, res: Response) => {
  const result = await businessServices.getSingle(
    req.params.id as string,
    req.user!.id
  );
  sendResponse(res, {
    message: "User retrieved successfully!",
    data: result,
  });
});

const updateMyProfile = handleAsyncRequest(
  async (req: TRequest, res: Response) => {
    const result = await businessServices.updateMyProfile(
      req.user!.email,
      req.body
    );
    sendResponse(res, {
      message: "Profile updated successfully!",
      data: result,
    });
  }
);

const updateProfileImage = handleAsyncRequest(
  async (req: TRequest, res: Response) => {
    const result = await businessServices.updateProfileImage(
      req.user!.email,
      req.file as TFile
    );
    sendResponse(res, {
      message: "Profile image updated successfully!",
      data: result,
    });
  }
);

export const businessController = {
  signUp,
  getSingle,
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
};
