import { GridDataModel, GridDataDocument } from "@src/models/grid-data.model";
import { generateErrorObject } from "@src/helper/response.helper";
import { PaginateResult } from "mongoose";
import gridService from "./grid.service";

interface GridDataPayload {
  grid: string;
  rowData: Map<string, any>;
}

class GridDataService {
  async create(data: GridDataPayload): Promise<GridDataDocument> {
    const gridData = new GridDataModel(data);
    return gridData.save();
  }
  insertMany(data: GridDataPayload[]): Promise<GridDataDocument[]> {
    return GridDataModel.insertMany(data);
  }

  async get(options?: any): Promise<PaginateResult<GridDataDocument>> {
    const filter: any = { grid: options.gridId };
    if (options.globalSearch) {
      const data = await gridService.getOne(options.gridId);
      if (data) {
        const globalSearchRegex = new RegExp(options.globalSearch, "i");
        const globalSearchConditions: any = [];
        data.columnConfig.forEach(({ field }) => {
          globalSearchConditions.push({
            [`rowData.${field}`]: { $regex: globalSearchRegex },
          });
        });
        if (globalSearchConditions.length > 0) {
          filter.$or = globalSearchConditions;
        }
      } else {
        console.log("data is null");
      }
    }
    if (options.filters) {
      const parsedFilters = JSON.parse(decodeURIComponent(options.filters));
      const mongoFilters = parsedFilters.map((f: any) => {
        if (f.conditions) {
          const conditions = f.conditions.map((cond: any) => {
            let queryCondition;
            switch (cond.type) {
              case "contains":
                queryCondition = { $regex: new RegExp(cond.value, "i") };
                break;
              case "notContains":
                queryCondition = { $not: new RegExp(cond.value, "i") };
                break;
              case "equals":
                queryCondition = { $eq: cond.value };
                break;
              case "notEquals":
                queryCondition = { $ne: cond.value };
                break;
              case "startsWith":
                queryCondition = { $regex: new RegExp(`^${cond.value}`, "i") };
                break;
              case "endsWith":
                queryCondition = { $regex: new RegExp(`${cond.value}$`, "i") };
                break;
              case "blank":
                queryCondition = { $in: [null, ""] }; // Matches null or empty string
                break;
              case "notBlank":
                queryCondition = { $nin: [null, ""] }; // Does not match null or empty string
                break;
              default:
                return null;
            }
            return { [`rowData.${f.column}`]: queryCondition };
          });
          // Combine conditions with $and or $or
          if (f.operator === "AND") {
            return { $and: conditions };
          } else if (f.operator === "OR") {
            return { $or: conditions };
          }
        } else if (f.type && f.value) {
          // Single condition
          let queryCondition;
          switch (f.type) {
            case "contains":
              queryCondition = { $regex: new RegExp(f.value, "i") };
              break;
            case "notContains":
              queryCondition = { $not: new RegExp(f.value, "i") };
              break;
            case "equals":
              queryCondition = { $eq: f.value };
              break;
            case "notEquals":
              queryCondition = { $ne: f.value };
              break;
            case "startsWith":
              queryCondition = { $regex: new RegExp(`^${f.value}`, "i") };
              break;
            case "endsWith":
              queryCondition = { $regex: new RegExp(`${f.value}$`, "i") };
              break;
            case "blank":
              queryCondition = { $in: [null, ""] }; // Matches null or empty string
              break;
            case "notBlank":
              queryCondition = { $nin: [null, ""] }; // Does not match null or empty string
              break;
            default:
              return null;
          }
          return { [`rowData.${f.column}`]: queryCondition };
        }
        return null;
      });

      // Add to the main filter object
      if (mongoFilters.length > 0) {
        filter.$and = mongoFilters.filter(Boolean);
      }
    }

    const sort = { createdAt: -1 };
    let paginateOptions = {
      sort,
      lean: true,
      select: "rowData",
    };
    if (options.pageSize) {
      Object.assign(paginateOptions, { limit: options.pageSize });
    }
    if (options.page) {
      Object.assign(paginateOptions, { page: options.page });
    }
    return GridDataModel.paginate(filter, paginateOptions);
  }

  async getOne(id: string): Promise<GridDataDocument | null> {
    const gridData = await GridDataModel.findById(id);
    if (!gridData) {
      throw generateErrorObject(404, "Grid data not found");
    }
    return gridData;
  }

  async update(
    id: string,
    data: Partial<GridDataPayload>
  ): Promise<GridDataDocument | null> {
    const updatedGridData = await GridDataModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedGridData) {
      throw generateErrorObject(404, "Grid data not found");
    }
    return updatedGridData;
  }

  async delete(id: string): Promise<void> {
    const result = await GridDataModel.findByIdAndDelete(id);
    if (!result) {
      throw generateErrorObject(404, "Grid data not found");
    }
  }
}

export default new GridDataService();
