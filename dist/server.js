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
    server = app_1.default.listen(config_1.default.port, () => {
        console.log(` API server is running on port: ${config_1.default.port}`);
    });
    const socketServer = new http_1.Server();
    (0, socket_init_1.initSocket)(socketServer);
    socketServer.listen(config_1.default.socket_port, () => {
        console.log("🚀 Socket server is running on port:", config_1.default.socket_port);
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