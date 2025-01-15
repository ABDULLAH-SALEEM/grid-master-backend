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
const response_helper_1 = require("@src/helper/response.helper");
const util_1 = require("@src/util/util");
const email_service_1 = __importDefault(require("@src/services/email.service"));
const optLength = 8;
class Controller {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.generateResponse(res, "", 400, "Missing required fields");
                    return;
                }
                const token = yield auth_service_1.default.login(req.body);
                res.generateResponse(res, { token }, 200, "User logged in successfully!");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, firstName, lastName } = req.body;
                if (!email || !password || !lastName || !firstName) {
                    res.generateResponse(res, "", 400, "Missing required fields");
                    return;
                }
                const userData = yield auth_service_1.default.getOne({ email });
                if (userData) {
                    res.generateResponse(res, "", 400, "Email alredy exists");
                    return;
                }
                const otp = (0, util_1.generateOTP)(optLength);
                yield auth_service_1.default.createOTP({ email, otp, userData: req.body });
                const payload = {
                    email,
                    id: 2,
                    params: { OTP: otp },
                };
                yield email_service_1.default.sendEmail(payload);
                res.generateResponse(res, { otp }, 200, "Please check your email address.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
    recoverAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    res.generateResponse(res, "", 400, "Missing required fields");
                    return;
                }
                const userData = yield auth_service_1.default.getOne({ email }, { email: 1, isSocialLogin: 1 });
                if (!userData) {
                    res.generateResponse(res, "", 404, "Account not found");
                    return;
                }
                if (userData.isSocialLogin) {
                    res.generateResponse(res, "", 404, "Social Account");
                    return;
                }
                const otp = (0, util_1.generateOTP)(optLength);
                yield auth_service_1.default.createOTP({ email, otp });
                const payload = {
                    email,
                    id: 2,
                    params: { OTP: otp },
                };
                yield email_service_1.default.sendEmail(payload);
                res.generateResponse(res, { otp }, 200, "Please check your email address.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, email, verificationMode } = req.body;
                if (!otp || !email || !verificationMode) {
                    res.generateResponse(res, "", 400, "Missing required fields");
                    return;
                }
                const data = yield auth_service_1.default.verifyOtp(req.body);
                if (data === null || data === void 0 ? void 0 : data.isNewUser) {
                    res.generateResponse(res, {}, 200, "Account successfully created. You can login now.");
                    return;
                }
                if (data === null || data === void 0 ? void 0 : data.isAccRecovery) {
                    res.generateResponse(res, { token: data.token }, 200, "OTP verified. You can now reset password.");
                    return;
                }
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = req.body;
                if (!password) {
                    res.generateResponse(res, "", 400, "Missing required fields");
                    return;
                }
                const data = yield auth_service_1.default.updateOne({ _id: req.user._id }, req.body);
                res.generateResponse(res, data, 200, "Password reset successfully.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
    authMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.generateResponse(res, req.user, 200, "Logged in user fetched successfully.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
    socialLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { access_token } = req.body;
                if (!access_token) {
                    res.generateResponse(res, "", 400, "Missing required field");
                    return;
                }
                const resp = yield auth_service_1.default.socialLogin(access_token);
                res.generateResponse(res, { token: resp }, 200, "Social login successful.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                if (!name) {
                    res.generateResponse(res, "", 400, "Missing required field");
                    return;
                }
                const resp = yield auth_service_1.default.updateOne({ _id: req.user._id }, req.body);
                res.generateResponse(res, {}, 200, "Profile updated successfully.");
            }
            catch (error) {
                const err = (0, response_helper_1.manageError)(error);
                res.generateResponse(res, "", err.code, err.message);
            }
        });
    }
}
exports.default = new Controller();
