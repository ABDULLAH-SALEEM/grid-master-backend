"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const v1_1 = __importDefault(require("./v1"));
router.use("/v1", v1_1.default);
router.get("/", (req, res) => {
    generateResponse(res, { data: "Yo ! what up" }, 200, "Got it successfully!");
});
function generateResponse(res, data, statusCode, message) {
    res.status(statusCode).json({ data, message });
}
exports.default = router;
