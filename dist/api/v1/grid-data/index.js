"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const grid_data_controller_1 = __importDefault(require("./grid-data.controller"));
const gridDataRouter = express_1.default.Router();
gridDataRouter.post("/", grid_data_controller_1.default.create);
gridDataRouter.get("/", grid_data_controller_1.default.get);
gridDataRouter.put("/:id", grid_data_controller_1.default.update);
gridDataRouter.delete("/:id", grid_data_controller_1.default.delete);
exports.default = gridDataRouter;
