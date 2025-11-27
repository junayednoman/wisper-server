"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneZod = exports.emailZod = exports.passwordZod = void 0;
const zod_1 = __importDefault(require("zod"));
exports.passwordZod = zod_1.default
    .string({ message: "Password is required" })
    .min(7, "Password must be at least 7 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
exports.emailZod = zod_1.default
    .string({ message: "Email is required" })
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .nonempty("Email is required");
exports.phoneZod = zod_1.default
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .nullish()
    .transform(val => val ?? null);
//# sourceMappingURL=global.validation.js.map