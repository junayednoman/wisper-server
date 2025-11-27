"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePersonProfileZod = exports.personSignupZod = void 0;
const zod_1 = require("zod");
const global_validation_1 = require("../../validation/global.validation");
exports.personSignupZod = zod_1.z.object({
    password: global_validation_1.passwordZod,
    person: zod_1.z.object({
        email: global_validation_1.emailZod,
        name: zod_1.z.string({ message: "Name is required" }).min(2, "Name is too short"),
        phone: zod_1.z.string().optional(),
        title: zod_1.z
            .string({ message: "Title is required" })
            .min(4, "Title is too short"),
        industry: zod_1.z
            .string({ message: "Industry is required" })
            .min(2, "Industry is required"),
    }),
});
exports.updatePersonProfileZod = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is too short").optional(),
    phone: zod_1.z.string().optional(),
    title: zod_1.z.string().min(2, "Title is too short").optional(),
    industry: zod_1.z.string().min(2, "Industry is too short").optional(),
    address: zod_1.z.string().min(2, "Address is too short").optional(),
});
//# sourceMappingURL=person.validation.js.map