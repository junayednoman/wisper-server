import { log } from "console";
import { Server } from "http";
import app from "./app/app";
import config from "./app/config";
import { initSocket } from "./app/socket/socket.init";
let server: Server;

const main = () => {
  server = app.listen(config.port, () => {
    console.log(` API server is running on port: ${config.port}`);
  });
  initSocket(server);
};

main();

process.on("uncaughtException", error => {
  log(error);
  if (server) {
    server.close(() => {
      console.log("Server closed due to uncaught exception");
      process.exit(1);
    });
  }
});

process.on("unhandledRejection", error => {
  log(error);
  if (server) {
    server.close(() => {
      console.log("Server closed due to unhandled rejection");
      process.exit(1);
    });
  }
});
