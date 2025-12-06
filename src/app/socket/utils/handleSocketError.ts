import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Socket } from "socket.io";
import ApiError from "../../middlewares/classes/ApiError";
import { TAckFn } from "../interface/socket.interface";
import ackHandler from "./ackHandler";

export const handleSocketError = (err: any, socket: Socket, ack?: TAckFn) => {
  let status = 500;
  let message = "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    status = 422;
    message = "Validation error!";

    const missingMatch = err.message.match(/Argument `(\w+)` is missing/);
    const unknownMatch = err.message.match(/Unknown argument `(\w+)`/);
    const invalidMatch = err.message.match(
      /Argument `(\w+)`: Invalid value provided/
    );
    const invalidEnumMatch = err.message.match(
      /Invalid value for argument `(\w+)`/
    );

    if (missingMatch) {
      const field = missingMatch[1];
      message = `Field '${field}' is required!`;
      error = { message, path: field, code: "missing_field" };
    } else if (unknownMatch) {
      const field = unknownMatch[1];
      message = `Field '${field}' does not exist on this model!`;
      error = { message, path: field, code: "unknown_field" };
    } else if (invalidMatch) {
      const field = invalidMatch[1];
      message = `Field '${field}' has an invalid value or type!`;
      error = { message, path: field, code: "invalid_value" };
    } else if (invalidEnumMatch) {
      const field = invalidEnumMatch[1];
      message = `Field '${field}' has an invalid enum value!`;
      error = { message, path: field, code: "invalid_enum_value" };
    } else {
      message = err.message.split("\n")[0] || message;
      error = err.message;
    }
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
    error,
  });
};
