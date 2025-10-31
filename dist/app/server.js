"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const main = () => {
    const server = app_1.default.listen(config_1.default.port, () => {
        console.log(`Server is running on port ${config_1.default.port}`);
    });
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
};
main();
//# sourceMappingURL=server.js.map