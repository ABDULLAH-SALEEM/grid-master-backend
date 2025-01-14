import express, { Router } from "express";
import authController from "./auth.controller";
import authMiddleware from "@src/middlewares/auth";
const authRouter: Router = express.Router();

authRouter.post("/login", authController.login);
authRouter.post("/signup", authController.signup);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/recover-acc", authController.recoverAccount);
authRouter.put("/", authMiddleware, authController.updateUser);
authRouter.post("/social-login", authController.socialLogin);
authRouter.post(
  "/change-password",
  authMiddleware,
  authController.changePassword
);
authRouter.get("/auth-me", authMiddleware, authController.authMe);

export default authRouter;
