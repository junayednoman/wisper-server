import { Request, Response } from "express";
export declare const authController: {
    verifyOtp: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    sendOtp: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    changePassword: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    changeAccountStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    refreshToken: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map