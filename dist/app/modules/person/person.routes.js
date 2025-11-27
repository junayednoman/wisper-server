"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.personRoutes = void 0;
const express_1 = require("express");
const person_controller_1 = require("./person.controller");
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const client_1 = require("@prisma/client");
const handleZodValidation_1 = __importDefault(require("../../middlewares/handleZodValidation"));
const person_validation_1 = require("./person.validation");
const awss3_1 = require("../../utils/awss3");
const router = (0, express_1.Router)();
router.get("/profile", (0, authorize_1.default)(client_1.UserRole.PERSON), person_controller_1.personController.getMyProfile);
router.get("/roles", (0, authorize_1.default)(client_1.UserRole.PERSON, client_1.UserRole.BUSINESS), person_controller_1.personController.getUserRoles);
router.get("/:id", (0, authorize_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.PERSON, client_1.UserRole.BUSINESS), person_controller_1.personController.getSingle);
router.patch("/profile", (0, authorize_1.default)(client_1.UserRole.PERSON), (0, handleZodValidation_1.default)(person_validation_1.updatePersonProfileZod), person_controller_1.personController.updateMyProfile);
router.patch("/profile-image", (0, authorize_1.default)(client_1.UserRole.PERSON), awss3_1.upload.single("image"), person_controller_1.personController.updateProfileImage);
exports.personRoutes = router;
//# sourceMappingURL=person.routes.js.map