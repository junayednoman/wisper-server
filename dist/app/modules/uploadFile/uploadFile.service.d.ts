import { TFile } from "../../interface/file.interface";
export declare const uploadFileServices: {
    uploadFile: (file: TFile) => Promise<string>;
    deleteFile: (url: string) => Promise<void>;
    uploadFiles: (files: TFile[]) => Promise<string[]>;
    deleteFiles: (urls: string[]) => Promise<void>;
};
//# sourceMappingURL=uploadFile.service.d.ts.map