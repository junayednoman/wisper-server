import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { authServices } from "./auth.service";
import config from "../../config";
import { TRequest } from "../../interface/global.interface";

const login = handleAsyncRequest(async (req: Request, res: Response) => {
  const result = await authServices.login(req.body);

  // set up cookie
  const day = 24 * 60 * 60 * 1000;
  const { refreshToken, accessToken } = result;
  const cookieOptions: any = {
    httpOnly: true,
    secure: config.env === "production", // Use secure in production
    maxAge: 60 * day,
  };

  if (config.env === "production") cookieOptions.sameSite = "none";

  res.cookie("wisper-serviceRefreshToken", refreshToken, cookieOptions);

  sendResponse(res, {
    message: "Logged in successfully!",
    data: { accessToken },
  });
});

const verifyOtp = handleAsyncRequest(async (req: Request, res: Response) => {
  const result = await authServices.verifyOtp(req.body);
  sendResponse(res, {
    message: "OTP verified successfully!",
    data: result,
  });
});

const sendOtp = handleAsyncRequest(async (req: Request, res: Response) => {
  const result = await authServices.sendOtp(req.body.email);
  sendResponse(res, {
    message: "OTP sent successfully!",
    data: result,
  });
});

const resetPassword = handleAsyncRequest(
  async (req: Request, res: Response) => {
    const result = await authServices.resetPassword(req.body);
    sendResponse(res, {
      message: "Password reset successfully!",
      data: result,
    });
  }
);

const changePassword = handleAsyncRequest(
  async (req: TRequest, res: Response) => {
    const result = await authServices.changePassword(
      req.body,
      req.user?.id as string
    );
    sendResponse(res, {
      message: "Password changed successfully!",
      data: result,
    });
  }
);

const changeAccountStatus = handleAsyncRequest(
  async (req: TRequest, res: Response) => {
    const { message } = await authServices.changeAccountStatus(
      req.params.userId as string,
      req.body.status
    );
    sendResponse(res, {
      message,
      data: null,
    });
  }
);

const refreshToken = handleAsyncRequest(
  async (req: TRequest, res: Response) => {
    const token = req.cookies.wisperRefreshToken;
    const result = await authServices.refreshToken(token);
    sendResponse(res, {
      message: "Token refreshed successfully!",
      data: result,
    });
  }
);

export const authController = {
  verifyOtp,
  login,
  sendOtp,
  resetPassword,
  changePassword,
  changeAccountStatus,
  refreshToken,
};
