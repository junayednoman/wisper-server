import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { jobServices } from "./job.service";

const createJob = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await jobServices.createJob(req.user!.id, req.body);
  sendResponse(res, {
    message: "Job created successfully!",
    data: result,
    status: 201,
  });
});

export const jobController = { createJob };
