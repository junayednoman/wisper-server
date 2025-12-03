import jwt from "jsonwebtoken";
import config from "../../config";
import ApiError from "../../middlewares/classes/ApiError";
import { TSocketUser } from "../interface/socket.interface";
import { Socket } from "socket.io";

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
  const authHeader =
    socket.handshake.auth.authorization ||
    socket.handshake.headers.authorization;

  if (!authHeader) {
    throw new ApiError(401, "Token not found");
  }
  const token = authHeader.split("Bearer ")[1];

  if (!token) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    const decoded = jwt.verify(
      token,
      config.jwt.accessSecret as string
    ) as TSocketUser;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    socket.auth = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err: unknown) {
    console.error(err);
    next(new ApiError(401, "Unauthorized"));
  }
};
