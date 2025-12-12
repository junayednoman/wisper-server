import { Server } from "socket.io";
import http from "http";
import { registerSocketEvents } from "./socket.events";
import { socketAuth } from "./utils/socket.auth";
import { joinChatHandler } from "./handlers/joinChat.handler";
import { TSocket } from "./interface/socket.interface";
import onlineUsers from "./utils/onlineUsers";

let io: Server | null = null;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket: any) => {
    // add user to online user list
    const userId = socket.auth.id;
    onlineUsers[userId] = socket;

    joinChatHandler(socket as TSocket);
    registerSocketEvents(socket);
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
