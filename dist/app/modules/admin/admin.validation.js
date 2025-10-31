"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUpdateZod = void 0;
const zod_1 = __importDefault(require("zod"));
exports.profileUpdateZod = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required").trim(),
    phone: zod_1.default.string().min(1, "Phone is required").trim(),
});
//# sourceMappingURL=admin.validation.js.map