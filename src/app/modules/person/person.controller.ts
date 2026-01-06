import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { Response } from "express";
import { personServices } from "./person.service";
import { TFile } from "../../interface/file.interface";
import pick from "../../utils/pick";

const signUp = handleAsyncRequest(async (req: TRequest, res: Response) => {
  const result = await personServices.signUp(req.body);
  sendResponse(res, {
    message: "User created successfully!",
    data: result,
    status: 201,
  });
});

const getSingle = handleAsyncRequest(async (req: TRequest, res: Response) => {
  const result = await personServices.getSingle(
    req.params.id as string,
    req.user!.id
  );
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

const getUserRoles = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await personServices.getUserRoles(
    options,
    req.query,
    req.user!.id
  );
  sendResponse(res, {
    message: "Roles retrieved successfully!",
    data: result,
  });
});

export const personController = {
  signUp,
  getSingle,
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
  getUserRoles,
};
