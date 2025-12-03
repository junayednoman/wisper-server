import { UserRole } from "@prisma/client";
import { Socket } from "socket.io";

export type TSocketUser = { id: string; email: string; role?: UserRole };

export type TAckRes = { success: boolean; message?: string };
export type TAckFn = (response: TAckRes) => void;

export type TSocketHandler<TData> = (
  socket: TSocket,
  data: TData,
  ack: TAckFn
) => Promise<void>;

export type TError = {
  message: string;
  statusCode?: number;
};

export type TSocket = Socket & {
  auth: TSocketUser;
};
