import { Socket } from "socket.io";
import { sendMessage } from "./handlers/message/sendMessage.handler";
import startTyping from "./handlers/message/startTyping.handler";
import stopTyping from "./handlers/message/stopTyping";
import disconnect from "./handlers/disconnect.handler";
import editMessage from "./handlers/message/editMessage.handler";
import deleteMessage from "./handlers/message/deleteMessage.handler";
import { seenMessage } from "./handlers/message/seenMessage.handler";
import { callInvite } from "./handlers/call/callInvite.handler";
import { callAccept } from "./handlers/call/callAccept.handler";
import { callDecline } from "./handlers/call/callDecline.handler";
import { callCancel } from "./handlers/call/callCancel.handler";
import { callEnd } from "./handlers/call/callEnd.handler";

export const registerSocketEvents = (socket: Socket) => {
  socket.on("sendMessage", sendMessage);
  socket.on("startTyping", startTyping);
  socket.on("stopTyping", stopTyping);
  socket.on("disconnect", disconnect);
  socket.on("editMessage", editMessage);
  socket.on("deleteMessage", deleteMessage);
  socket.on("seenMessage", seenMessage);
  socket.on("callInvite", callInvite);
  socket.on("callAccept", callAccept);
  socket.on("callDecline", callDecline);
  socket.on("callCancel", callCancel);
  socket.on("callEnd", callEnd);
};
