"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("./classes/ApiError"));
const config_1 = __importDefault(require("../config"));
const authorize = (...roles) => {
    return async (req, _res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new ApiError_1.default(401, "Unauthorized");
            }
            const token = authHeader.split("Bearer ")[1];
            if (!token)
                throw new ApiError_1.default(401, "Unauthorized");
            const decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.jwt.accessSecret);
            req.user = decodedUser;
            if (roles.length && !roles.includes(decodedUser.role)) {
                throw new ApiError_1.default(403, "Forbidden!");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = authorize;
//# sourceMappingURL=authorize.js.map