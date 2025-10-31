import { UserStatus } from "@prisma/client";
import { TChangePasswordInput, TLoginInput, TResetPasswordInput, TVerifyOtpInput } from "./auth.validation";
export declare const authServices: {
    verifyOtp: (payload: TVerifyOtpInput) => Promise<void>;
    login: (payload: TLoginInput) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    sendOtp: (email: string) => Promise<void>;
    refreshToken: (token: string) => Promise<{
        accessToken: string;
    }>;
    resetPassword: (payload: TResetPasswordInput) => Promise<void>;
    changePassword: (payload: TChangePasswordInput, userId: string) => Promise<void>;
    changeAccountStatus: (userId: string, status: UserStatus) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map