"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const handleAsyncRequest_1 = __importDefault(require("../../utils/handleAsyncRequest"));
const sendResponse_1 = require("../../utils/sendResponse");
const admin_service_1 = require("./admin.service");
const getProfile = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await admin_service_1.adminServices.getProfile(req.user?.email);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Profile fetched successfully!",
        data: result,
    });
});
const updateProfile = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await admin_service_1.adminServices.updateProfile(req.user?.email, req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Profile updated successfully!",
        data: result,
    });
});
exports.adminController = {
    getProfile,
    updateProfile,
};
//# sourceMappingURL=admin.controller.js.map