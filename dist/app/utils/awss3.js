"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromS3 = exports.uploadToS3 = exports.upload = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client_s3_2 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../config"));
const multer_1 = __importStar(require("multer"));
const ApiError_1 = __importDefault(require("../middlewares/classes/ApiError"));
exports.s3Client = new client_s3_2.S3Client({
    endpoint: config_1.default.aws.endpoint,
    region: `${config_1.default.aws.region}`,
    credentials: {
        accessKeyId: `${config_1.default.aws.accessKeyId}`,
        secretAccessKey: `${config_1.default.aws.secretAccessKey}`,
    },
});
exports.upload = (0, multer_1.default)({
    storage: (0, multer_1.memoryStorage)(),
});
//upload a single file
const uploadToS3 = async (file) => {
    const fileName = `images/noman/${Date.now()}-${file.originalname}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: config_1.default.aws.bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: client_s3_1.ObjectCannedACL.public_read, //access public read
    });
    try {
        const key = await exports.s3Client.send(command);
        if (!key) {
            throw new ApiError_1.default(400, "File Upload failed");
        }
        const url = `${config_1.default?.aws?.s3BaseUrl}/${fileName}`;
        if (!url)
            throw new ApiError_1.default(400, "File Upload failed");
        return url;
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(400, "File Upload failed");
    }
};
exports.uploadToS3 = uploadToS3;
// // delete file from s3 bucket
const deleteFromS3 = async (url) => {
    const key = decodeURIComponent(url.split(".digitaloceanspaces.com/")[1]);
    try {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: config_1.default.aws.bucket,
            Key: key,
        });
        await exports.s3Client.send(command);
    }
    catch (error) {
        console.log("🚀 ~ deleteFromS3 ~ error:", error);
    }
};
exports.deleteFromS3 = deleteFromS3;
//# sourceMappingURL=awss3.js.map