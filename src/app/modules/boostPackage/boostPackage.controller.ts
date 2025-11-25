import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { boostPackageService } from "./boostPackage.service";

const createBoostPackage = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await boostPackageService.createBoostPackage(req.body);
  sendResponse(res, {
    message: "Boost package created successfully!",
    data: result,
    status: 201,
  });
});

const getPackages = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await boostPackageService.getPackages(req.query);
  sendResponse(res, {
    message: "Boost packages retrieved successfully!",
    data: result,
  });
});

const getSinglePackage = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await boostPackageService.getSinglePackage(
    req.params.id as string
  );
  sendResponse(res, {
    message: "Boost package retrieved successfully!",
    data: result,
  });
});

const updatePackage = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await boostPackageService.updatePackage(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    message: "Boost package updated successfully!",
    data: result,
  });
});

const deletePackage = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await boostPackageService.deletePackage(
    req.params.id as string
  );
  sendResponse(res, {
    message: "Boost package deleted successfully!",
    data: result,
  });
});

export const boostPackageController = {
  createBoostPackage,
  getPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
};
