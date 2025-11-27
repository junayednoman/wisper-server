import { UserStatus } from "@prisma/client";
import { TChangePasswordInput, TLoginInput, TResetPasswordInput } from "./auth.validation";
import { TPaginationOptions } from "../../utils/paginationCalculation";
export declare const authServices: {
    login: (payload: TLoginInput) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getAll: (options: TPaginationOptions) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        personAuths: {
            id: string;
            createdAt: Date;
            person: {
                id: string;
                email: string;
                name: string;
                phone: string | null;
                industry: string;
                image: string | null;
                title: string | null;
                address: string | null;
            } | null;
            business: {
                id: string;
                email: string;
                name: string;
                phone: string | null;
                industry: string;
                image: string | null;
                address: string | null;
            } | null;
        }[];
    }>;
    refreshToken: (token: string) => Promise<{
        accessToken: string;
    }>;
    resetPassword: (payload: TResetPasswordInput) => Promise<void>;
    changePassword: (payload: TChangePasswordInput, userId: string) => Promise<void>;
    changeAccountStatus: (userId: string, status: UserStatus) => Promise<{
        message: string;
    }>;
    toggleNotificationPermission: (id: string) => Promise<{
        id: string;
        allowNotifications: boolean;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map