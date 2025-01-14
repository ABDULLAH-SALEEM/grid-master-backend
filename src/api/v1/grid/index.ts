import express, { Router } from "express";
import gridController from "./grid.controller";

const gridRouter: Router = express.Router();
gridRouter.post("/", gridController.create);
gridRouter.get("/", gridController.get);
gridRouter.get("/:id", gridController.getOne);
gridRouter.put("/:id", gridController.update);
gridRouter.delete("/:id", gridController.delete);

export default gridRouter;
