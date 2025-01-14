import { Request, Response } from "express";
import gridService from "@src/services/grid.service";
import { manageError } from "@src/helper/response.helper";

class GridController {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const { name, description, actions, file } = req.body;
      if (!name || !description || !actions || !file) {
        res.generateResponse(res, "", 400, "Missing required fields");
        return;
      }
      const grid = await gridService.create({
        user: req.user._id,
        ...req.body,
      });
      res.generateResponse(res, grid, 201, "Grid created successfully.");
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      if (!id || (!name && !description)) {
        res.generateResponse(res, "", 400, "Missing required fields.");
        return;
      }
      const updatedGrid = await gridService.update(id, req.body);
      res.generateResponse(res, updatedGrid, 200, "Grid updated successfully.");
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      if (!id) {
        res.generateResponse(res, "", 400, "Missing required field: id");
        return;
      }
      await gridService.delete(id);
      res.generateResponse(res, {}, 200, "Grid deleted successfully.");
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }

  async get(req: Request, res: Response): Promise<any> {
    try {
      const grids = await gridService.getAll({
        userId: req.user._id,
        ...req.query,
      });
      res.generateResponse(res, grids, 200, "Grids fetched successfully.");
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }

  async getOne(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      if (!id) {
        res.generateResponse(res, "", 400, "Missing required field: id");
        return;
      }
      const grid = await gridService.getOne(id);
      res.generateResponse(res, grid, 200, "Grid fetched successfully.");
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }
}

export default new GridController();
