import express, { Router } from "express";
import actionController from "./action.controller";

const actionRouter: Router = express.Router();
actionRouter.post("/", actionController.create);
actionRouter.get("/", actionController.get);

export default actionRouter;
