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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("@src/models/user.model");
const response_helper_1 = require("@src/helper/response.helper");
const otp_model_1 = require("@src/models/otp.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enum_1 = require("@src/common/enum");
const axios_1 = __importDefault(require("axios"));
const util_1 = require("@src/util/util");
const signOptions = {
    expiresIn: process.env.TOKEN_EXPIRE_TIME,
};
const secret = process.env.JWT_SECRET || "";
class AuthService {
    dataHasher(data) {
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashedData = bcrypt_1.default.hashSync(data, salt);
        return hashedData;
    }
    userDataToken(data) {
        const token = jsonwebtoken_1.default.sign(data, secret, {
            expiresIn: "3m",
        });
        return token;
    }
    getOne(filter_1) {
        return __awaiter(this, arguments, void 0, function* (filter, select = { name: 1, email: 1 }) {
            return user_model_1.UserModel.findOne(filter, select).exec();
        });
    }
    updateOne(filter, update) {
        if (update === null || update === void 0 ? void 0 : update.password) {
            update.password = this.dataHasher(update.password);
        }
        return user_model_1.UserModel.findOneAndUpdate(filter, update, { new: true }).select("name email");
    }
    create(data) {
        const { email, isSocialLogin, firstName, lastName } = data;
        let password;
        if ("password" in data) {
            password = this.dataHasher(data.password);
        }
        const user = new user_model_1.UserModel({
            email,
            password,
            firstName,
            lastName,
            isSocialLogin,
        });
        return user.save();
    }
    createOTP(data) {
        const { otp, email } = data;
        let userDataToken;
        if (data === null || data === void 0 ? void 0 : data.userData) {
            userDataToken = this.userDataToken(data.userData);
        }
        const otpDoc = new otp_model_1.OTPModel({
            email,
            otp: this.dataHasher(otp),
            userToken: userDataToken,
        });
        return otpDoc.save();
    }
    login(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorMsg = "Invalid email or password!";
            const { email, password } = userData;
            const user = yield this.getOne({ email }, { password: 1 });
            if (!user) {
                throw (0, response_helper_1.generateErrorObject)(401, errorMsg);
            }
            const comparePassword = yield bcrypt_1.default.compare(password, user.password);
            if (comparePassword) {
                return jsonwebtoken_1.default.sign({ _id: user._id }, secret, signOptions);
            }
            throw (0, response_helper_1.generateErrorObject)(401, errorMsg);
        });
    }
    verifyOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, otp, verificationMode } = data;
            const otpData = yield otp_model_1.OTPModel.findOne({ email }).sort({ createdAt: -1 });
            if (!otpData) {
                throw (0, response_helper_1.generateErrorObject)(404, "OTP not found.");
            }
            const isMatch = yield bcrypt_1.default.compare(otp, otpData.otp);
            if (!isMatch) {
                throw (0, response_helper_1.generateErrorObject)(404, "Invalid OTP");
            }
            if (verificationMode === enum_1.OTP_VERIFICATION_MODE.NEW_USER) {
                const token = otpData.userToken;
                const data = jsonwebtoken_1.default.verify(token, secret);
                const user = this.create(data);
                return { user, isNewUser: true };
            }
            if (verificationMode === enum_1.OTP_VERIFICATION_MODE.ACCOUNT_RECOVERY) {
                const user = yield this.getOne({ email });
                const token = jsonwebtoken_1.default.sign({ _id: user._id, isAccRecovery: true }, secret, {
                    expiresIn: "5m",
                });
                return { isAccRecovery: true, token };
            }
            throw (0, response_helper_1.generateErrorObject)(400, "Invalid option");
        });
    }
    verifyGoogleToken(token) {
        return axios_1.default.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    socialLogin(access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { email, verified_email, name }, } = yield this.verifyGoogleToken(access_token);
            const user = yield this.getOne({ email: email });
            if (user && !user.isSocialLogin) {
                throw (0, response_helper_1.generateErrorObject)(401, "You are already registered with this email. Please use your email and password to login.");
            }
            if (user && verified_email && user.isSocialLogin) {
                return jsonwebtoken_1.default.sign({ _id: user._id }, secret, signOptions);
            }
            if (verified_email && !user) {
                const { firstName, lastName } = (0, util_1.getFirstAndLastName)(name);
                const body = {
                    email,
                    isSocialLogin: true,
                    firstName,
                    lastName,
                };
                const newUser = yield this.create(body);
                if (!newUser) {
                    throw (0, response_helper_1.generateErrorObject)(401, "Error creating social user");
                }
                return jsonwebtoken_1.default.sign({ _id: newUser._id }, secret, signOptions);
            }
        });
    }
    changePassword(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentPass, password } = body;
            const user = yield this.getOne({ _id: id }, { password: 1 });
            if (!user) {
                throw (0, response_helper_1.generateErrorObject)(404, "User not found");
            }
            const comparePassword = yield bcrypt_1.default.compare(currentPass, user.password);
            if (!comparePassword) {
                throw (0, response_helper_1.generateErrorObject)(401, "Current password is invalid.");
            }
            return this.updateOne({ _id: id }, { password });
        });
    }
}
exports.default = new AuthService();
