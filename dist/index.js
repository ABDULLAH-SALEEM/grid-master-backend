"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./pre-start");
const jet_logger_1 = __importDefault(require("jet-logger"));
const server_1 = __importDefault(require("./server"));
const port = parseInt(process.env.PORT || "8080", 10);
const SERVER_START_MSG = "Express server started on port: " + port;
server_1.default.listen(port, "0.0.0.0", () => jet_logger_1.default.info(SERVER_START_MSG));
