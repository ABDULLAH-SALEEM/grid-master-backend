"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const auth_1 = __importDefault(require("@src/middlewares/auth"));
const authRouter = express_1.default.Router();
authRouter.post("/login", auth_controller_1.default.login);
authRouter.post("/signup", auth_controller_1.default.signup);
authRouter.post("/verify-otp", auth_controller_1.default.verifyOtp);
authRouter.post("/recover-acc", auth_controller_1.default.recoverAccount);
authRouter.put("/", auth_1.default, auth_controller_1.default.updateUser);
authRouter.post("/social-login", auth_controller_1.default.socialLogin);
authRouter.post("/change-password", auth_1.default, auth_controller_1.default.changePassword);
authRouter.get("/auth-me", auth_1.default, auth_controller_1.default.authMe);
exports.default = authRouter;
