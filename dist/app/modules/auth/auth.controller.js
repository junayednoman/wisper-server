"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const handleAsyncRequest_1 = __importDefault(require("../../utils/handleAsyncRequest"));
const sendResponse_1 = require("../../utils/sendResponse");
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../config"));
const login = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await auth_service_1.authServices.login(req.body);
    // set up cookie
    const day = 24 * 60 * 60 * 1000;
    const { refreshToken, accessToken } = result;
    const cookieOptions = {
        httpOnly: true,
        secure: config_1.default.env === "production", // Use secure in production
        maxAge: 60 * day,
    };
    if (config_1.default.env === "production")
        cookieOptions.sameSite = "none";
    res.cookie("refreshToken", refreshToken, cookieOptions);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Logged in successfully!",
        data: { accessToken },
    });
});
const verifyOtp = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await auth_service_1.authServices.verifyOtp(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        message: "OTP verified successfully!",
        data: result,
    });
});
const sendOtp = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await auth_service_1.authServices.sendOtp(req.body.email);
    (0, sendResponse_1.sendResponse)(res, {
        message: "OTP sent successfully!",
        data: result,
    });
});
const resetPassword = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await auth_service_1.authServices.resetPassword(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Password reset successfully!",
        data: result,
    });
});
const changePassword = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await auth_service_1.authServices.changePassword(req.body, req.user?.id);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Password changed successfully!",
        data: result,
    });
});
const changeAccountStatus = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const { message } = await auth_service_1.authServices.changeAccountStatus(req.params.userId, req.body.status);
    (0, sendResponse_1.sendResponse)(res, {
        message,
        data: null,
    });
});
const refreshToken = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const token = req.cookies.refreshToken;
    const result = await auth_service_1.authServices.refreshToken(token);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Token refreshed successfully!",
        data: result,
    });
});
exports.authController = {
    verifyOtp,
    login,
    sendOtp,
    resetPassword,
    changePassword,
    changeAccountStatus,
    refreshToken,
};
//# sourceMappingURL=auth.controller.js.map