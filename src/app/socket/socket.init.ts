import { Server } from "socket.io";
import http from "http";
import { registerSocketEvents } from "./socket.events";
import { socketAuth } from "./utils/socket.auth";
import { joinChatHandler } from "./handlers/joinChat.handler";
import { TSocket } from "./interface/socket.interface";

let io: Server | null = null;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(socketAuth);

  io.on("connection", socket => {
    joinChatHandler(socket as TSocket);
    registerSocketEvents(socket);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
