"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileController = void 0;
const handleAsyncRequest_1 = __importDefault(require("../../utils/handleAsyncRequest"));
const sendResponse_1 = require("../../utils/sendResponse");
const uploadFile_service_1 = require("./uploadFile.service");
const uploadSingle = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const file = req.file;
    const url = await uploadFile_service_1.uploadFileServices.uploadFile(file);
    (0, sendResponse_1.sendResponse)(res, {
        message: "File uploaded successfully!",
        data: { url },
    });
});
const uploadMultiple = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const files = req.files;
    const urls = await uploadFile_service_1.uploadFileServices.uploadFiles(files);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Files uploaded successfully!",
        data: { urls },
    });
});
const deleteSingle = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const { url } = req.body;
    const result = await uploadFile_service_1.uploadFileServices.deleteFile(url);
    (0, sendResponse_1.sendResponse)(res, { message: "File deleted successfully!", data: result });
});
const deleteMultiple = (0, handleAsyncRequest_1.default)(async (req, res) => {
    const { urls } = req.body;
    const result = await uploadFile_service_1.uploadFileServices.deleteFiles(urls);
    (0, sendResponse_1.sendResponse)(res, { message: "Files deleted successfully!", data: result });
});
exports.fileController = {
    uploadSingle,
    uploadMultiple,
    deleteSingle,
    deleteMultiple,
};
//# sourceMappingURL=uploadFile.controller.js.map