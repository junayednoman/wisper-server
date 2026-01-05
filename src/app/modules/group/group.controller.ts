import { TFile } from "../../interface/file.interface";
import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { groupServices } from "./group.service";

const createGroup = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await groupServices.createGroup(req.body, req.user!.id);
  sendResponse(res, {
    message: "Group created successfully!",
    data: result,
    status: 201,
  });
});

const getAllGroups = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await groupServices.getAllGroups(options, req.query);
  sendResponse(res, {
    message: "Groups retrieved successfully!",
    data: result,
  });
});

const getSingleGroup = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await groupServices.getSingleGroup(req.params.id as string);
  sendResponse(res, {
    message: "Group retrieved successfully!",
    data: result,
  });
});

const getGroupMembers = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await groupServices.getGroupMembers(
    req.params.id as string,
    options,
    req.query
  );
  sendResponse(res, {
    message: "Group members retrieved successfully!",
    data: result,
  });
});

const addGroupMember = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await groupServices.addGroupMember(
    req.params.id as string,
    req.body.member,
    req.user!.id
  );
  sendResponse(res, {
    message: "Group member added successfully!",
    data: result,
  });
});

const changeGroupImage = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await groupServices.changeGroupImage(
    req.params.id as string,
    req.file as TFile
  );
  sendResponse(res, {
    message: "Group image changed successfully!",
    data: result,
  });
});

const updateGroupData = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await groupServices.updateGroupData(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    message: "Group data updated successfully!",
    data: result,
  });
});

const toggleGroupVisibility = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await groupServices.toggleGroupVisibility(
    req.params.id as string
  );
  sendResponse(res, {
    message: "Group visibility updated successfully!",
    data: result,
  });
});

const toggleGroupInvitationAccess = handleAsyncRequest(
  async (req: TRequest, res) => {
    const result = await groupServices.toggleGroupInvitationAccess(
      req.params.id as string
    );
    sendResponse(res, {
      message: "Group invitation access updated successfully!",
      data: result,
    });
  }
);

export const groupController = {
  createGroup,
  getAllGroups,
  getSingleGroup,
  addGroupMember,
  changeGroupImage,
  updateGroupData,
  toggleGroupVisibility,
  toggleGroupInvitationAccess,
  getGroupMembers,
};
