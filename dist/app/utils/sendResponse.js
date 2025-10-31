"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, { status = 200, success = true, message, data }) => {
    res.status(status).json({
        success,
        message,
        data: data || null,
    });
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map