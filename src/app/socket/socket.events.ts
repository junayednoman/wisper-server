import { Socket } from "socket.io";
import { sendMessage } from "./handlers/message.handler";
import startTyping from "./handlers/startTyping.handler";
import stopTyping from "./handlers/stopTyping";
import disconnect from "./handlers/disconnect.handler";

export const registerSocketEvents = (socket: Socket) => {
  socket.on("sendMessage", sendMessage);
  socket.on("startTyping", startTyping);
  socket.on("stopTyping", stopTyping);
  socket.on("disconnect", disconnect);
};
