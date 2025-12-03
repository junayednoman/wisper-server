import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Socket } from "socket.io";
import ApiError from "../../middlewares/classes/ApiError";
import { TAckFn } from "../interface/socket.interface";
import ackHandler from "./ackHandler";

export const handleSocketError = (err: any, socket: Socket, ack?: TAckFn) => {
  let status = 500;
  let message = "Something went wrong!";

  if (err instanceof Prisma.PrismaClientValidationError) {
    status = 422;
    message = "Validation error!";
  } else if (
    err instanceof PrismaClientKnownRequestError ||
    err.name === "PrismaClientKnownRequestError"
  ) {
    switch (err.code) {
      case "P2002":
        message = `${err.meta?.modelName || "Record"} already exists!`;
        status = 409;
        break;
      case "P2025":
        message = `${err.meta?.modelName || "Record"} not found!`;
        status = 404;
        break;
      case "P2003":
        message = `${err.meta?.modelName || "Record"} is associated with other data!`;
        status = 400;
        break;
      default:
        message = err.message;
    }
  } else if (err instanceof ApiError) {
    status = err.statusCode;
    message = err.message;
  } else if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token!";
  } else if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token expired!";
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  if (ack) {
    ackHandler(ack, { success: false, message });
  }

  socket.emit("socketError", {
    success: false,
    status,
    message,
    error: err,
  });
};
