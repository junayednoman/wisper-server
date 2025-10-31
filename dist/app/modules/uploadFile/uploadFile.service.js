"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileServices = void 0;
const awss3_1 = require("../../utils/awss3");
const uploadFile = async (file) => {
    if (!file)
        throw new Error("No file provided!");
    const url = await (0, awss3_1.uploadToS3)(file);
    return url;
};
const deleteFile = async (url) => {
    await (0, awss3_1.deleteFromS3)(url);
};
const uploadFiles = async (files) => {
    if (!files || !files.length)
        throw new Error("No files provided!");
    const urls = [];
    for (const file of files) {
        const url = await (0, awss3_1.uploadToS3)(file);
        urls.push(url);
    }
    return urls;
};
const deleteFiles = async (urls) => {
    if (!urls || !urls.length)
        throw new Error("No URLs provided!");
    for (const url of urls) {
        await (0, awss3_1.deleteFromS3)(url);
    }
};
exports.uploadFileServices = {
    uploadFile,
    deleteFile,
    uploadFiles,
    deleteFiles,
};
//# sourceMappingURL=uploadFile.service.js.map