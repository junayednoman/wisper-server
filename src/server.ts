import { log } from "console";
import { Server } from "http";
import app from "./app/app";
import config from "./app/config";

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
