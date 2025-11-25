import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { dashboardServices } from "./dashboard.service";

const getDashboardStats = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await dashboardServices.getDashboardStats();
  sendResponse(res, {
    message: "Dashboard stats retrieved successfully!",
    data: result,
  });
});

const getUserOverview = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await dashboardServices.getUserOverview(req.query);
  sendResponse(res, {
    message: "User overview retrieved successfully!",
    data: result,
  });
});

export const dashboardController = { getDashboardStats, getUserOverview };
