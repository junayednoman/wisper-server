import { TFile } from "../../interface/file.interface";
import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { resumeService } from "./resume.service";

const addResume = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await resumeService.addResume(req.user!.id, req.file as TFile);
  sendResponse(res, {
    message: "Resume added successfully!",
    data: result,
    status: 201,
  });
});

const geUserResumes = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await resumeService.geUserResumes(req.params.authId as string);
  sendResponse(res, {
    message: "Resumes retrieved successfully!",
    data: result,
  });
});

const changeDefaultResume = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await resumeService.changeDefaultResume(
    req.user!.id,
    req.params.id as string
  );
  sendResponse(res, {
    message: "Default resume changed successfully!",
    data: result,
  });
});

const deleteResume = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await resumeService.deleteResume(
    req.params.id as string,
    req.user!.id
  );
  sendResponse(res, {
    message: "Resume deleted successfully!",
    data: result,
  });
});

export const resumeController = {
  addResume,
  geUserResumes,
  changeDefaultResume,
  deleteResume,
};
