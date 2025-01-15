"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const grid_controller_1 = __importDefault(require("./grid.controller"));
const gridRouter = express_1.default.Router();
gridRouter.post("/", grid_controller_1.default.create);
gridRouter.get("/", grid_controller_1.default.get);
gridRouter.get("/:id", grid_controller_1.default.getOne);
gridRouter.put("/:id", grid_controller_1.default.update);
gridRouter.delete("/:id", grid_controller_1.default.delete);
exports.default = gridRouter;
