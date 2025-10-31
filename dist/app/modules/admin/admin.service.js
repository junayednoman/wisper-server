"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServices = void 0;
const awss3_1 = require("../../utils/awss3");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getProfile = async (email) => {
    const admin = await prisma_1.default.admin.findUniqueOrThrow({
        where: {
            email: email,
        },
    });
    return admin;
};
const updateProfile = async (email, payload, file) => {
    const admin = await prisma_1.default.admin.findUniqueOrThrow({
        where: {
            email: email,
        },
    });
    if (file) {
        payload.profileImage = await (0, awss3_1.uploadToS3)(file);
    }
    const result = await prisma_1.default.admin.update({
        where: {
            email: email,
        },
        data: payload,
    });
    if (result && payload.profileImage && admin.profileImage) {
        await (0, awss3_1.deleteFromS3)(admin.profileImage);
    }
    return result;
};
exports.adminServices = {
    getProfile,
    updateProfile,
};
//# sourceMappingURL=admin.service.js.map