"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("./auth"));
const grid_1 = __importDefault(require("./grid"));
const action_1 = __importDefault(require("./action"));
const auth_2 = __importDefault(require("@src/middlewares/auth"));
const grid_data_1 = __importDefault(require("./grid-data"));
router.use("/auth", auth_1.default);
router.use("/grid", auth_2.default, grid_1.default);
router.use("/grid-action", auth_2.default, action_1.default);
router.use("/grid-data", auth_2.default, grid_data_1.default);
exports.default = router;
