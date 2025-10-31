"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routeNotFoundHandler = (req, res, _next) => {
    res.status(404).json({
        success: false,
        message: "API route not found!",
        path: req.originalUrl,
    });
};
exports.default = routeNotFoundHandler;
//# sourceMappingURL=routeNotFoundHandler.js.map