import { TFile } from "../../interface/file.interface";
import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { classServices } from "./class.service";

const createClass = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await classServices.createClass(req.body, req.user!.id);
  sendResponse(res, {
    message: "Class created successfully!",
    data: result,
    status: 201,
  });
});

const getSingleClass = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await classServices.getSingleClass(req.params.id as string);
  sendResponse(res, {
    message: "Classes retrieved successfully!",
    data: result,
  });
});

const getClassMembers = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await classServices.getClassMembers(req.params.id as string);
  sendResponse(res, {
    message: "Class members retrieved successfully!",
    data: result,
  });
});

const addClassMember = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await classServices.addClassMember(
    req.params.id as string,
    req.body.member,
    req.user!.id
  );
  sendResponse(res, {
    message: "Class member added successfully!",
    data: result,
  });
});

const changeClassImage = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await classServices.changeClassImage(
    req.params.id as string,
    req.file as TFile
  );
  sendResponse(res, {
    message: "Class image changed successfully!",
    data: result,
  });
});

const updateClassData = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await classServices.updateClassData(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    message: "Class data updated successfully!",
    data: result,
  });
});

const toggleClassVisibility = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await classServices.toggleClassVisibility(
    req.params.id as string
  );
  sendResponse(res, {
    message: "Class visibility updated successfully!",
    data: result,
  });
});

const toggleClassInvitationAccess = handleAsyncRequest(
  async (req: TRequest, res) => {
    const result = await classServices.toggleClassInvitationAccess(
      req.params.id as string
    );
    sendResponse(res, {
      message: "Class invitation access updated successfully!",
      data: result,
    });
  }
);

export const classController = {
  createClass,
  getSingleClass,
  addClassMember,
  changeClassImage,
  updateClassData,
  toggleClassVisibility,
  toggleClassInvitationAccess,
  getClassMembers,
};
