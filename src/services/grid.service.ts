import { GridModel, GridDocument } from "@src/models/grid.model";
import { generateErrorObject } from "@src/helper/response.helper";
import { PaginateResult } from "mongoose";
import firebaseService from "./firebase.service";
import * as xlsx from "xlsx";
import * as csvParser from "papaparse";
import fileParserService from "./file-parser.service";
import gridDataService from "./grid-data.service";

interface GridData {
  user: string;
  name: string;
  columnConfig: { field: string }[];
  actions: string[];
  file: { name: string; url: string };
}

class GridService {
  async create(data: GridData): Promise<GridDocument> {
    const { columns, rows } = await fileParserService.processFile(
      data.file.url,
      data.file.name
    );
    firebaseService.deleteFile(data.file.url);
    const payload = {
      ...data,
      columnConfig: columns.map((column) => ({ field: column })),
    };
    const grid = new GridModel(payload);
    const savedGrid = await grid.save();

    await gridDataService.insertMany(
      rows.map((row) => ({
        rowData: new Map(Object.entries(row)),
        grid: (savedGrid._id as string).toString(),
      }))
    );
    return savedGrid;
  }

  async getAll(options?: any): Promise<PaginateResult<GridDocument>> {
    const filter = { user: options.userId };
    const sort = { createdAt: -1 };
    let paginateOptions = {
      sort,
      lean: true,
      select: "name description columnConfig actions",
      populate: {
        path: "actions",
        select: "label name",
      },
    };
    if (options.pageSize) {
      Object.assign(paginateOptions, { limit: options.pageSize });
    }
    if (options.page) {
      Object.assign(paginateOptions, { page: options.page });
    }
    return GridModel.paginate(filter, paginateOptions);
  }

  async getOne(id: string): Promise<GridDocument | null> {
    const grid = await GridModel.findById(id).select("columnConfig");
    if (!grid) {
      throw generateErrorObject(404, "Grid not found");
    }
    return grid;
  }

  async update(
    id: string,
    data: Partial<GridData>
  ): Promise<GridDocument | null> {
    const updatedGrid = await GridModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedGrid) {
      throw generateErrorObject(404, "Grid not found");
    }
    return updatedGrid;
  }

  async delete(id: string): Promise<void> {
    const result = await GridModel.findByIdAndDelete(id);
    if (!result) {
      throw generateErrorObject(404, "Grid not found");
    }
  }
}

export default new GridService();
