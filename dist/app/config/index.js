"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    email: {
        emailSendingApi: process.env.SEND_EMAIL_URL,
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        accessExpiration: process.env.JWT_ACCESS_EXPIRATION,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
    },
    aws: {
        accessKeyId: process.env.S3_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY,
        s3BaseUrl: process.env.S3_BASE_URL,
        s3_api: process.env.S3_API,
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_BUCKET_NAME,
        endpoint: process.env.SPACES_API,
    },
};
//# sourceMappingURL=index.js.map