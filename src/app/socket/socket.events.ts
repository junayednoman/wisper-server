import { Socket } from "socket.io";
import { sendMessage } from "./handlers/sendMessage.handler";
import startTyping from "./handlers/startTyping.handler";
import stopTyping from "./handlers/stopTyping";
import disconnect from "./handlers/disconnect.handler";
import editMessage from "./handlers/editMessage.handler";
import deleteMessage from "./handlers/deleteMessage.handler";
import { seenMessage } from "./handlers/seenMessage.handler";

export const registerSocketEvents = (socket: Socket) => {
  socket.on("sendMessage", sendMessage);
  socket.on("startTyping", startTyping);
  socket.on("stopTyping", stopTyping);
  socket.on("disconnect", disconnect);
  socket.on("editMessage", editMessage);
  socket.on("deleteMessage", deleteMessage);
  socket.on("seenMessage", seenMessage);
};
