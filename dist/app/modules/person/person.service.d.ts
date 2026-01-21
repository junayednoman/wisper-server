import { TPersonSignUp, TUpdatePersonProfile } from "./person.validation";
import { TFile } from "../../interface/file.interface";
import { TPaginationOptions } from "../../utils/paginationCalculation";
export declare const personServices: {
    signUp: (payload: TPersonSignUp) => Promise<{
        id: string;
        email: string;
        updatedAt: Date;
        name: string;
        phone: string | null;
        image: string | null;
        industry: string;
        title: string | null;
        defaultResumeId: string | null;
        address: string | null;
    }>;
    getSingle: (id: string, currentAuthId: string) => Promise<{
        auth: {
            id: string;
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
        } | null;
        connection: {
            id: string;
            status: import(".prisma/client").$Enums.ConnectionStatus;
            createdAt: Date;
            requesterId: string;
            receiverId: string;
        } | null;
    }>;
    getMyProfile: (id: string) => Promise<{
        auth: {
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
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
                defaultResume: {
                    createdAt: Date;
                    name: string;
                    file: string;
                    fileSize: string;
                } | null;
            } | null;
        } | null;
    }>;
    updateMyProfile: (email: string, payload: TUpdatePersonProfile) => Promise<{
        id: string;
        email: string;
        updatedAt: Date;
        name: string;
        phone: string | null;
        image: string | null;
        industry: string;
        title: string | null;
        defaultResumeId: string | null;
        address: string | null;
    }>;
    updateProfileImage: (email: string, file: TFile) => Promise<{
        id: string;
        email: string;
        updatedAt: Date;
        name: string;
        phone: string | null;
        image: string | null;
        industry: string;
        title: string | null;
        defaultResumeId: string | null;
        address: string | null;
    }>;
    getUserRoles: (options: TPaginationOptions, query: Record<string, any>, currentAuthId: string) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        roles: {
            connectionStatus: string;
            id: string;
            person: {
                name: string;
                image: string | null;
                title: string | null;
            } | null;
            requestedConnections: {
                status: import(".prisma/client").$Enums.ConnectionStatus;
                requesterId: string;
            }[];
            receivedConnections: {
                status: import(".prisma/client").$Enums.ConnectionStatus;
                receiverId: string;
            }[];
            _count: {
                posts: number;
                receivedRecommendations: number;
            };
        }[];
    }>;
};
//# sourceMappingURL=person.service.d.ts.map