import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import { TFile } from "../interface/file.interface";
export declare const s3Client: S3Client;
export declare const upload: multer.Multer;
export declare const uploadToS3: (file: TFile) => Promise<string>;
export declare const deleteFromS3: (url: string) => Promise<void>;
//# sourceMappingURL=awss3.d.ts.map