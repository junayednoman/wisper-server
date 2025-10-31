"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeAccountStatusZod = exports.changePasswordZod = exports.resetPasswordZod = exports.loginZodSchema = exports.verifyOtpZod = void 0;
const zod_1 = __importDefault(require("zod"));
const global_validation_1 = require("../../validation/global.validation");
const client_1 = require("@prisma/client");
exports.verifyOtpZod = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email address").trim().toLowerCase(),
    otp: zod_1.default
        .string()
        .min(6, "OTP must be at least 6 characters long")
        .max(6, "OTP must be at most 6 characters long"),
    verifyAccount: zod_1.default.boolean().optional(),
});
exports.loginZodSchema = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email address").trim().toLowerCase(),
    password: zod_1.default.string().min(1, "Password is required").trim(),
    fcmToken: zod_1.default.string().optional(),
    isMobileApp: zod_1.default.boolean().default(false),
});
exports.resetPasswordZod = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email address").trim().toLowerCase(),
    password: global_validation_1.passwordZod,
});
exports.changePasswordZod = zod_1.default.object({
    oldPassword: zod_1.default.string().min(1, "Old password is required").trim(),
    newPassword: global_validation_1.passwordZod,
});
exports.changeAccountStatusZod = zod_1.default.object({
    status: zod_1.default
        .enum([client_1.UserStatus.ACTIVE, client_1.UserStatus.DELETED, client_1.UserStatus.BLOCKED])
        .default("ACTIVE")
        .transform(val => val.toUpperCase()),
});
//# sourceMappingURL=auth.validation.js.map