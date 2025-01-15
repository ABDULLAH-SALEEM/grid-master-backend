"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const action_controller_1 = __importDefault(require("./action.controller"));
const actionRouter = express_1.default.Router();
actionRouter.post("/", action_controller_1.default.create);
actionRouter.get("/", action_controller_1.default.get);
exports.default = actionRouter;
