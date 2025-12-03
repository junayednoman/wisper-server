import { Socket } from "socket.io";
import { sendMessage } from "./handlers/message.handler";
export const registerSocketEvents = (socket: Socket) => {
  socket.on("sendMessage", sendMessage);

  // 🔹 Disconnect
  socket.on("disconnect", () => {
    console.log("🚫 User disconnected:", socket.id);
  });
};
