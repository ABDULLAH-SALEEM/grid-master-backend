import express, { Router } from "express";
const router: Router = express.Router();
import authRouter from "./auth";
import gridRouter from "./grid";
import actionRouter from "./action";
import authMiddleware from "@src/middlewares/auth";
import gridDataRouter from "./grid-data";
router.use("/auth", authRouter);
router.use("/grid", authMiddleware, gridRouter);
router.use("/grid-action", authMiddleware, actionRouter);
router.use("/grid-data", authMiddleware, gridDataRouter);

export default router;
