import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { complaintService } from "./complaint.service";

const createComplaint = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await complaintService.createComplaint(req.user!.id, req.body);
  sendResponse(res, {
    message: "Complaint created successfully!",
    data: result,
    status: 201,
  });
});

const getAllComplaints = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await complaintService.getAllComplaints(options, req.query);
  sendResponse(res, {
    message: "Complaints retrieved successfully!",
    data: result,
  });
});

export const complaintController = { createComplaint, getAllComplaints };
