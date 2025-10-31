"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const handleZodValidation_1 = __importDefault(require("../../middlewares/handleZodValidation"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/login", (0, handleZodValidation_1.default)(auth_validation_1.loginZodSchema), auth_controller_1.authController.login);
router.post("/verify-otp", (0, handleZodValidation_1.default)(auth_validation_1.verifyOtpZod), auth_controller_1.authController.verifyOtp);
router.post("/send-otp", auth_controller_1.authController.sendOtp);
router.post("/reset-password", (0, handleZodValidation_1.default)(auth_validation_1.resetPasswordZod), auth_controller_1.authController.resetPassword);
router.post("/change-password", (0, authorize_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.PERSON, client_1.UserRole.BUSINESS), (0, handleZodValidation_1.default)(auth_validation_1.changePasswordZod), auth_controller_1.authController.changePassword);
router.patch("/change-account-status/:userId", (0, authorize_1.default)(client_1.UserRole.ADMIN), (0, handleZodValidation_1.default)(auth_validation_1.changeAccountStatusZod), auth_controller_1.authController.changeAccountStatus);
router.get("/refresh-token", auth_controller_1.authController.refreshToken);
exports.authRoutes = router;
//# sourceMappingURL=auth.routes.js.map