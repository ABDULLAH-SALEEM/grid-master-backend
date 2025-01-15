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
const action_service_1 = __importDefault(require("@src/services/action.service"));
class ActionController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, label } = req.body;
                if (!name || !label) {
                    res.generateResponse(res, "", 400, "Missing required fields: name, label");
                    return;
                }
                const action = yield action_service_1.default.create(req.body);
                res.generateResponse(res, action, 201, "Action created successfully.");
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
                const grids = yield action_service_1.default.getAll();
                res.generateResponse(res, grids, 200, "Actions fetched successfully.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
}
exports.default = new ActionController();
