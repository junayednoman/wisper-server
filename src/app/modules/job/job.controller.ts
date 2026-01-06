import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
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

const getAllJobs = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await jobServices.getAllJobs(options, req.query);
  sendResponse(res, {
    message: "Jobs retrieved successfully!",
    data: result,
  });
});

const getSingleJob = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await jobServices.getSingleJob(
    req.params.id as string,
    req.user!.id
  );
  sendResponse(res, {
    message: "Job retrieved successfully!",
    data: result,
  });
});

const updateJob = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await jobServices.updateJob(
    req.params.id as string,
    req.user!.id,
    req.body
  );
  sendResponse(res, {
    message: "Job updated successfully!",
    data: result,
  });
});

const deleteJob = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await jobServices.deleteJob(
    req.params.id as string,
    req.user!.id
  );
  sendResponse(res, {
    message: "Job deleted successfully!",
    data: result,
  });
});

export const jobController = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
};
