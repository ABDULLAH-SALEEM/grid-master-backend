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
const response_helper_1 = require("@src/helper/response.helper");
const grid_data_service_1 = __importDefault(require("@src/services/grid-data.service"));
class GridDataController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gridId, data } = req.body;
                if (!gridId || !data) {
                    res.generateResponse(res, "", 400, "Missing required fields: gridId, data");
                    return;
                }
                const gridData = yield grid_data_service_1.default.create(req.body);
                res.generateResponse(res, gridData, 201, "Grid data created successfully.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { data } = req.body;
                if (!id || !data) {
                    res.generateResponse(res, "", 400, "Missing required fields.");
                    return;
                }
                const updatedGridData = yield grid_data_service_1.default.update(id, req.body.data);
                res.generateResponse(res, updatedGridData, 200, "Grid data updated successfully.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.generateResponse(res, "", 400, "Missing required field: id");
                    return;
                }
                yield grid_data_service_1.default.delete(id);
                res.generateResponse(res, {}, 200, "Grid data deleted successfully.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gridId } = req.query;
                if (!gridId) {
                    res.generateResponse(res, "", 400, "Missing required field: gridId");
                    return;
                }
                const gridData = yield grid_data_service_1.default.get(req.query);
                res.generateResponse(res, gridData, 200, "Grid data fetched successfully.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
}
exports.default = new GridDataController();
