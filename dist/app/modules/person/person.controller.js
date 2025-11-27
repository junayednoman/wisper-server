"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.personController = void 0;
const handleAsyncRequest_1 = __importDefault(require("../../utils/handleAsyncRequest"));
const sendResponse_1 = require("../../utils/sendResponse");
const person_service_1 = require("./person.service");
const pick_1 = __importDefault(require("../../utils/pick"));
const signUp = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await person_service_1.personServices.signUp(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        message: "User created successfully!",
        data: result,
        status: 201,
    });
});
const getSingle = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await person_service_1.personServices.getSingle(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        message: "User retrieved successfully!",
        data: result,
    });
});
const getMyProfile = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await person_service_1.personServices.getMyProfile(req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Profile retrieved successfully!",
        data: result,
    });
});
const updateMyProfile = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await person_service_1.personServices.updateMyProfile(req.user.email, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Profile updated successfully!",
        data: result,
    });
});
const updateProfileImage = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const result = await person_service_1.personServices.updateProfileImage(req.user.email, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Profile image updated successfully!",
        data: result,
    });
});
const getUserRoles = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "orderBy"]);
    const result = await person_service_1.personServices.getUserRoles(options);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Roles retrieved successfully!",
        data: result,
    });
});
exports.personController = {
    signUp,
    getSingle,
    getMyProfile,
    updateMyProfile,
    updateProfileImage,
    getUserRoles,
};
//# sourceMappingURL=person.controller.js.map