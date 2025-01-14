import { Request, Response } from "express";
import { manageError } from "@src/helper/response.helper";
import actionService from "@src/services/action.service";

class ActionController {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const { name, label } = req.body;
      if (!name || !label) {
        res.generateResponse(
          res,
          "",
          400,
          "Missing required fields: name, label"
        );
        return;
      }
      const action = await actionService.create(req.body);
      res.generateResponse(res, action, 201, "Action created successfully.");
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }
  async get(req: Request, res: Response): Promise<any> {
    try {
      const grids = await actionService.getAll();
      res.generateResponse(res, grids, 200, "Actions fetched successfully.");
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }
}

export default new ActionController();
