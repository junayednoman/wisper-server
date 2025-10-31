"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileRoutes = void 0;
const express_1 = require("express");
const awss3_1 = require("../../utils/awss3");
const uploadFile_controller_1 = require("./uploadFile.controller");
const router = (0, express_1.Router)();
router.post("/", awss3_1.upload.single("file"), uploadFile_controller_1.fileController.uploadSingle);
router.post("/multiple", awss3_1.upload.array("files"), uploadFile_controller_1.fileController.uploadMultiple);
router.delete("/", uploadFile_controller_1.fileController.deleteSingle);
router.delete("/multiple", uploadFile_controller_1.fileController.deleteMultiple);
exports.fileRoutes = router;
//# sourceMappingURL=uploadFile.routes.js.map