import express, { Router } from "express";
import gridDataController from "./grid-data.controller";

const gridDataRouter: Router = express.Router();
gridDataRouter.post("/", gridDataController.create);
gridDataRouter.get("/", gridDataController.get);
gridDataRouter.put("/:id", gridDataController.update);
gridDataRouter.delete("/:id", gridDataController.delete);

export default gridDataRouter;
