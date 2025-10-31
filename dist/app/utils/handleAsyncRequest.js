"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleAsyncRequest = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = handleAsyncRequest;
//# sourceMappingURL=handleAsyncRequest.js.map