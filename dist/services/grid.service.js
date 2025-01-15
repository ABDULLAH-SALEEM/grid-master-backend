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
const grid_model_1 = require("@src/models/grid.model");
const response_helper_1 = require("@src/helper/response.helper");
const firebase_service_1 = __importDefault(require("./firebase.service"));
const file_parser_service_1 = __importDefault(require("./file-parser.service"));
const grid_data_service_1 = __importDefault(require("./grid-data.service"));
class GridService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { columns, rows } = yield file_parser_service_1.default.processFile(data.file.url, data.file.name);
            firebase_service_1.default.deleteFile(data.file.url);
            const payload = Object.assign(Object.assign({}, data), { columnConfig: columns.map((column) => ({ field: column })) });
            const grid = new grid_model_1.GridModel(payload);
            const savedGrid = yield grid.save();
            yield grid_data_service_1.default.insertMany(rows.map((row) => ({
                rowData: new Map(Object.entries(row)),
                grid: savedGrid._id.toString(),
            })));
            return savedGrid;
        });
    }
    getAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return grid_model_1.GridModel.paginate(filter, paginateOptions);
        });
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const grid = yield grid_model_1.GridModel.findById(id).select("columnConfig");
            if (!grid) {
                throw (0, response_helper_1.generateErrorObject)(404, "Grid not found");
            }
            return grid;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedGrid = yield grid_model_1.GridModel.findByIdAndUpdate(id, data, {
                new: true,
            });
            if (!updatedGrid) {
                throw (0, response_helper_1.generateErrorObject)(404, "Grid not found");
            }
            return updatedGrid;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield grid_model_1.GridModel.findByIdAndDelete(id);
            if (!result) {
                throw (0, response_helper_1.generateErrorObject)(404, "Grid not found");
            }
        });
    }
}
exports.default = new GridService();
