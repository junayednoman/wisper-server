import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { Response } from "express";
import { personServices } from "./person.service";
import pick from "../../utils/pick";
import { TFile } from "../../interface/file.interface";

const signUp = handleAsyncRequest(async (req: TRequest, res: Response) => {
  const result = await personServices.signUp(req.body);
  sendResponse(res, {
    message: "User created successfully!",
    data: result,
    status: 201,
  });
});

const getAll = handleAsyncRequest(async (req: TRequest, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await personServices.getAll(options);
  sendResponse(res, {
    message: "Users retrieved successfully!",
    data: result,
  });
});

const getSingle = handleAsyncRequest(async (req: TRequest, res: Response) => {
  const result = await personServices.getSingle(req.params.id as string);
  sendResponse(res, {
    message: "User retrieved successfully!",
    data: result,
  });
});

const getMyProfile = handleAsyncRequest(
  async (req: TRequest, res: Response) => {
    const result = await personServices.getMyProfile(req.user!.id);
    sendResponse(res, {
      message: "Profile retrieved successfully!",
      data: result,
    });
  }
);

const updateMyProfile = handleAsyncRequest(
  async (req: TRequest, res: Response) => {
    const result = await personServices.updateMyProfile(
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
    const result = await personServices.updateProfileImage(
      req.user!.email,
      req.file as TFile
    );
    sendResponse(res, {
      message: "Profile image updated successfully!",
      data: result,
    });
  }
);

const toggleNotificationPermission = handleAsyncRequest(
  async (req: TRequest, res: Response) => {
    const result = await personServices.toggleNotificationPermission(
      req.user!.id
    );
    sendResponse(res, {
      message: "Notification permission updated successfully!",
      data: result,
    });
  }
);

export const personController = {
  signUp,
  getAll,
  getSingle,
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
  toggleNotificationPermission,
};
