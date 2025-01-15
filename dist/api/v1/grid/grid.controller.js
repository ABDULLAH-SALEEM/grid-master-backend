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
const grid_service_1 = __importDefault(require("@src/services/grid.service"));
const response_helper_1 = require("@src/helper/response.helper");
class GridController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, actions, file } = req.body;
                if (!name || !description || !actions || !file) {
                    res.generateResponse(res, "", 400, "Missing required fields");
                    return;
                }
                const grid = yield grid_service_1.default.create(Object.assign({ user: req.user._id }, req.body));
                res.generateResponse(res, grid, 201, "Grid created successfully.");
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
                const { name, description } = req.body;
                if (!id || (!name && !description)) {
                    res.generateResponse(res, "", 400, "Missing required fields.");
                    return;
                }
                const updatedGrid = yield grid_service_1.default.update(id, req.body);
                res.generateResponse(res, updatedGrid, 200, "Grid updated successfully.");
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
                yield grid_service_1.default.delete(id);
                res.generateResponse(res, {}, 200, "Grid deleted successfully.");
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
                const grids = yield grid_service_1.default.getAll(Object.assign({ userId: req.user._id }, req.query));
                res.generateResponse(res, grids, 200, "Grids fetched successfully.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.generateResponse(res, "", 400, "Missing required field: id");
                    return;
                }
                const grid = yield grid_service_1.default.getOne(id);
                res.generateResponse(res, grid, 200, "Grid fetched successfully.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
}
exports.default = new GridController();
