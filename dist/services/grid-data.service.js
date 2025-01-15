"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grid_data_model_1 = require("@src/models/grid-data.model");
const response_helper_1 = require("@src/helper/response.helper");
const grid_service_1 = __importDefault(require("./grid.service"));
class GridDataService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const gridData = new grid_data_model_1.GridDataModel(data);
            return gridData.save();
        });
    }
    insertMany(data) {
        return grid_data_model_1.GridDataModel.insertMany(data);
    }
    get(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { grid: options.gridId };
            if (options.globalSearch) {
                const data = yield grid_service_1.default.getOne(options.gridId);
                if (data) {
                    const globalSearchRegex = new RegExp(options.globalSearch, "i");
                    const globalSearchConditions = [];
                    data.columnConfig.forEach(({ field }) => {
                        globalSearchConditions.push({
                            [`rowData.${field}`]: { $regex: globalSearchRegex },
                        });
                    });
                    if (globalSearchConditions.length > 0) {
                        filter.$or = globalSearchConditions;
                    }
                }
                else {
                    console.log("data is null");
                }
            }
            if (options.filters) {
                const parsedFilters = JSON.parse(decodeURIComponent(options.filters));
                const mongoFilters = parsedFilters.map((f) => {
                    if (f.conditions) {
                        const conditions = f.conditions.map((cond) => {
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
                                    queryCondition = { $in: [null, ""] };
                                    break;
                                case "notBlank":
                                    queryCondition = { $nin: [null, ""] };
                                    break;
                                default:
                                    return null;
                            }
                            return { [`rowData.${f.column}`]: queryCondition };
                        });
                        if (f.operator === "AND") {
                            return { $and: conditions };
                        }
                        else if (f.operator === "OR") {
                            return { $or: conditions };
                        }
                    }
                    else if (f.type && f.value) {
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
                                queryCondition = { $in: [null, ""] };
                                break;
                            case "notBlank":
                                queryCondition = { $nin: [null, ""] };
                                break;
                            default:
                                return null;
                        }
                        return { [`rowData.${f.column}`]: queryCondition };
                    }
                    return null;
                });
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
            return grid_data_model_1.GridDataModel.paginate(filter, paginateOptions);
        });
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const gridData = yield grid_data_model_1.GridDataModel.findById(id);
            if (!gridData) {
                throw (0, response_helper_1.generateErrorObject)(404, "Grid data not found");
            }
            return gridData;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedGridData = yield grid_data_model_1.GridDataModel.findByIdAndUpdate(id, data, {
                new: true,
            });
            if (!updatedGridData) {
                throw (0, response_helper_1.generateErrorObject)(404, "Grid data not found");
            }
            return updatedGridData;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield grid_data_model_1.GridDataModel.findByIdAndDelete(id);
            if (!result) {
                throw (0, response_helper_1.generateErrorObject)(404, "Grid data not found");
            }
        });
    }
}
exports.default = new GridDataService();
