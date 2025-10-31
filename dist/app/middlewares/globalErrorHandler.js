"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("./classes/ApiError"));
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
const globalErrorHandler = (err, req, res, _next) => {
    let status = 500;
    const success = false;
    let message = "Something went wrong!";
    let error = err;
    const stack = err.stack;
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        status = 422;
        message = "Validation error!";
        error = err.message;
    }
    else if (err instanceof library_1.PrismaClientKnownRequestError ||
        err.name === "PrismaClientKnownRequestError") {
        if (err.code === "P2002") {
            message = `${err.meta?.modelName === "Auth" ? "User" : err.meta?.modelName} already exists with this ${(err.meta?.target)[0]}!`;
            error = err.meta;
        }
        else if (err.code === "P2025") {
            status = 404;
            message = `${err.meta?.modelName === "Auth" ? "User" : err.meta?.modelName} not found!`;
            error = err.meta;
        }
        else if (err.code === "P2003") {
            const constraint = err.meta?.constraint;
            const modelName = err.meta?.modelName || "Record";
            if (constraint) {
                if (req.method === "DELETE") {
                    message = `${modelName} cannot be deleted because it is associated with other data!`;
                    status = 409;
                }
                else if (["POST", "PUT", "PATCH"].includes(req.method)) {
                    const parentTable = constraint?.split("_")[1] || "parent";
                    message = `Invalid ${parentTable} id for ${modelName}!`;
                    status = 400;
                }
                else {
                    message = `${modelName} is associated with other data!`;
                    status = 409;
                }
            }
            else {
                message = `${modelName} is associated with other data!`;
                status = 409;
            }
            error = err.meta;
        }
    }
    else if (err.name === "ZodError") {
        status = 422;
        message = err.issues[0]?.message || "Validation error!";
        error = err.issues;
    }
    else if (err instanceof ApiError_1.default) {
        status = err.statusCode;
        message = err.message;
    }
    else if (err.name === "JsonWebTokenError") {
        status = 401;
        message = err?.message;
    }
    else if (err.name === "TokenExpiredError") {
        status = 401;
        message = err?.message;
    }
    else if (err.name === "MulterError") {
        status = 400;
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            message = err?.message;
            err = [
                {
                    path: "",
                    message: err?.message,
                },
            ];
        }
    }
    res.status(status).json({
        success,
        message,
        error,
        stack: config_1.default.env === "development" ? stack : undefined,
    });
};
exports.default = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map