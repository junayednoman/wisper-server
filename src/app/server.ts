import { log } from "console";
import app from "./app";
import config from "./config";
import { Server } from "http";

const main = () => {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });

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
};

main();
