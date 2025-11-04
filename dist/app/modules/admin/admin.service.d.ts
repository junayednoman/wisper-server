import { Admin } from "@prisma/client";
import { TFile } from "../../interface/file.interface";
export declare const adminServices: {
    getProfile: (email: string) => Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        profileImage: string | null;
    }>;
    updateProfile: (email: string, payload: Partial<Admin>, file?: TFile) => Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        profileImage: string | null;
    }>;
};
//# sourceMappingURL=admin.service.d.ts.map