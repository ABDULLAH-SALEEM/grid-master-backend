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
const auth_service_1 = __importDefault(require("@src/services/auth.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "";
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const unauthorizedErrorMsg = "Please provide a valid token!";
    const token = req.header("authorization");
    if (!token) {
        res.status(401).json({ message: unauthorizedErrorMsg });
        return;
    }
    try {
        if (token.includes("Bearer")) {
            const origirnalToken = token.split("Bearer ").pop() || "";
            const data = jsonwebtoken_1.default.verify(origirnalToken, secret);
            const user = yield auth_service_1.default.getOne({
                _id: data._id,
            }, { firstName: 1, email: 1, lastName: 1 });
            if (user && !(data === null || data === void 0 ? void 0 : data.isAccRecovery)) {
                req.user = Object.assign({}, user.toJSON());
                next();
            }
            else if ((data === null || data === void 0 ? void 0 : data.isAccRecovery) && data._id) {
                req.user = {
                    _id: data._id,
                };
                next();
            }
            else {
                res.status(401).json({ message: "Please verify your account!" });
                return;
            }
        }
        else {
            res.status(401).json({ message: unauthorizedErrorMsg });
        }
    }
    catch (error) {
        res.status(401).json({ message: unauthorizedErrorMsg });
    }
});
exports.default = authMiddleware;
