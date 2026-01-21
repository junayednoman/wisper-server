"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const http_1 = require("http");
const app_1 = __importDefault(require("./app/app"));
const config_1 = __importDefault(require("./app/config"));
const socket_init_1 = require("./app/socket/socket.init");
let server;
const main = () => {
    server = (0, http_1.createServer)(app_1.default);
    (0, socket_init_1.initSocket)(server);
    server.listen(config_1.default.port, () => {
        console.log(`Server running on port: ${config_1.default.port}`);
    });
};
main();
process.on("uncaughtException", error => {
    (0, console_1.log)(error);
    if (server) {
        server.close(() => {
            console.log("Server closed due to uncaught exception");
            process.exit(1);
        });
    }
});
process.on("unhandledRejection", error => {
    (0, console_1.log)(error);
    if (server) {
        server.close(() => {
            console.log("Server closed due to unhandled rejection");
            process.exit(1);
        });
    }
});
//# sourceMappingURL=server.js.map