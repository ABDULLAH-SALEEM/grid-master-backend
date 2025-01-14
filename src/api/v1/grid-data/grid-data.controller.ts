import { Request, Response } from "express";
import { manageError } from "@src/helper/response.helper";
import gridDataService from "@src/services/grid-data.service";

class GridDataController {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const { gridId, data } = req.body;
      if (!gridId || !data) {
        res.generateResponse(
          res,
          "",
          400,
          "Missing required fields: gridId, data"
        );
        return;
      }
      const gridData = await gridDataService.create(req.body);
      res.generateResponse(
        res,
        gridData,
        201,
        "Grid data created successfully."
      );
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { data } = req.body;
      if (!id || !data) {
        res.generateResponse(res, "", 400, "Missing required fields.");
        return;
      }
      const updatedGridData = await gridDataService.update(id, req.body.data);
      res.generateResponse(
        res,
        updatedGridData,
        200,
        "Grid data updated successfully."
      );
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
      await gridDataService.delete(id);
      res.generateResponse(res, {}, 200, "Grid data deleted successfully.");
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }

  async get(req: Request, res: Response): Promise<any> {
    try {
      const { gridId } = req.query;
      if (!gridId) {
        res.generateResponse(res, "", 400, "Missing required field: gridId");
        return;
      }
      const gridData = await gridDataService.get(req.query);
      res.generateResponse(
        res,
        gridData,
        200,
        "Grid data fetched successfully."
      );
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }
}

export default new GridDataController();
