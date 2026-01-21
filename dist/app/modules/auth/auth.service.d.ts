import { UserStatus } from "@prisma/client";
import { TChangePasswordInput, TGoogleLoginInput, TLoginInput, TResetPasswordInput } from "./auth.validation";
import { TPaginationOptions } from "../../utils/paginationCalculation";
export declare const authServices: {
    login: (payload: TLoginInput) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    googleLogin: (payload: TGoogleLoginInput) => Promise<{
        accessToken: string;
    }>;
    getSingle: (id: string) => Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        person: {
            name: string;
            image: string | null;
            title: string | null;
            address: string | null;
        } | null;
        business: {
            name: string;
            image: string | null;
            industry: string;
            address: string | null;
        } | null;
    } | null>;
    getAll: (options: TPaginationOptions, query: Record<string, any>) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        auths: {
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            person: {
                id: string;
                email: string;
                name: string;
                phone: string | null;
                image: string | null;
                industry: string;
                title: string | null;
                address: string | null;
            } | null;
            business: {
                id: string;
                email: string;
                name: string;
                phone: string | null;
                image: string | null;
                industry: string;
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