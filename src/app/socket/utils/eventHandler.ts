import { TAckFn, TSocket, TSocketHandler } from "../interface/socket.interface";
import { handleSocketError } from "./handleSocketError";

const eventHandler = <TData>(handler: TSocketHandler<TData>) => {
  return async function (this: TSocket, data: TData, ack: TAckFn) {
    try {
      await handler(this, data, ack);
    } catch (err: unknown) {
      handleSocketError(err, this, ack);
    }
  };
};

export default eventHandler;
