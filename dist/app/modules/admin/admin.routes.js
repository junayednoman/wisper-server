"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const admin_controller_1 = require("./admin.controller");
const handleZodValidation_1 = __importDefault(require("../../middlewares/handleZodValidation"));
const admin_validation_1 = require("./admin.validation");
const awss3_1 = require("../../utils/awss3");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get("/profile", (0, authorize_1.default)(client_1.UserRole.ADMIN), admin_controller_1.adminController.getProfile);
router.patch("/", (0, authorize_1.default)(client_1.UserRole.ADMIN), awss3_1.upload.single("image"), (0, handleZodValidation_1.default)(admin_validation_1.profileUpdateZod, { formData: true }), admin_controller_1.adminController.updateProfile);
exports.adminRoutes = router;
//# sourceMappingURL=admin.routes.js.map