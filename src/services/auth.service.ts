import bcrypt from "bcrypt";
import { UserModel, UserDocument } from "@src/models/user.model";
import { generateErrorObject } from "@src/helper/response.helper";
import { OTPModel } from "@src/models/otp.model";
import jwt, { SignOptions } from "jsonwebtoken";
import { OTP_VERIFICATION_MODE } from "@src/common/enum";
import axios from "axios";
import { getFirstAndLastName } from "@src/util/util";

interface OTPData {
  otp: string;
  email: string;
  userData?: UserDocument;
}
interface User {
  firstName: string;
  lastName: string;
  email: string;
  isSocialLogin: boolean;
}

const signOptions: SignOptions = {
  expiresIn: process.env.TOKEN_EXPIRE_TIME,
};

const secret: string = process.env.JWT_SECRET || "";
class AuthService {
  private dataHasher(data: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hashedData = bcrypt.hashSync(data, salt);
    return hashedData;
  }

  private userDataToken(data: UserDocument): string {
    const token = jwt.sign(data, secret, {
      expiresIn: "3m",
    });
    return token;
  }

  async getOne(
    filter: any,
    select: any = { name: 1, email: 1 }
  ): Promise<UserDocument | null> {
    return UserModel.findOne(filter, select).exec();
  }

  updateOne(filter: any, update: any) {
    if (update?.password) {
      update.password = this.dataHasher(update.password);
    }
    return UserModel.findOneAndUpdate(filter, update, { new: true }).select(
      "name email"
    );
  }

  create(data: User) {
    const { email, isSocialLogin, firstName, lastName } = data;
    let password;
    if ("password" in data) {
      password = this.dataHasher(data.password as string);
    }
    const user = new UserModel({
      email,
      password,
      firstName,
      lastName,
      isSocialLogin,
    });
    return user.save();
  }

  createOTP(data: OTPData) {
    const { otp, email } = data;
    let userDataToken;
    if (data?.userData) {
      userDataToken = this.userDataToken(data.userData);
    }
    const otpDoc = new OTPModel({
      email,
      otp: this.dataHasher(otp),
      userToken: userDataToken,
    });
    return otpDoc.save();
  }

  async login(userData: { email: string; password: string }): Promise<any> {
    const errorMsg = "Invalid email or password!";
    const { email, password } = userData;
    const user = await this.getOne({ email }, { password: 1 });
    if (!user) {
      throw generateErrorObject(401, errorMsg);
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (comparePassword) {
      return jwt.sign({ _id: user._id }, secret, signOptions);
    }
    throw generateErrorObject(401, errorMsg);
  }

  async verifyOtp(data: any) {
    const { email, otp, verificationMode } = data;
    const otpData = await OTPModel.findOne({ email }).sort({ createdAt: -1 });
    if (!otpData) {
      throw generateErrorObject(404, "OTP not found.");
    }
    const isMatch = await bcrypt.compare(otp, otpData.otp);
    if (!isMatch) {
      throw generateErrorObject(404, "Invalid OTP");
    }

    if (verificationMode === OTP_VERIFICATION_MODE.NEW_USER) {
      const token: any = otpData.userToken;
      const data = jwt.verify(token, secret) as UserDocument;
      const user = this.create(data);
      return { user, isNewUser: true };
    }
    if (verificationMode === OTP_VERIFICATION_MODE.ACCOUNT_RECOVERY) {
      const user: any = await this.getOne({ email });
      const token = jwt.sign({ _id: user._id, isAccRecovery: true }, secret, {
        expiresIn: "5m",
      });
      return { isAccRecovery: true, token };
    }
    throw generateErrorObject(400, "Invalid option");
  }

  verifyGoogleToken(token: string) {
    return axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async socialLogin(access_token: string) {
    const {
      data: { email, verified_email, name },
    } = await this.verifyGoogleToken(access_token);
    const user = await this.getOne({ email: email });
    if (user && !user.isSocialLogin) {
      throw generateErrorObject(
        401,
        "You are already registered with this email. Please use your email and password to login."
      );
    }
    if (user && verified_email && user.isSocialLogin) {
      return jwt.sign({ _id: user._id }, secret, signOptions);
    }
    if (verified_email && !user) {
      const { firstName, lastName } = getFirstAndLastName(name);
      const body = {
        email,
        isSocialLogin: true,
        firstName,
        lastName,
      };
      const newUser = await this.create(body);
      if (!newUser) {
        throw generateErrorObject(401, "Error creating social user");
      }
      return jwt.sign({ _id: newUser._id }, secret, signOptions);
    }
  }

  async changePassword(
    id: string,
    body: { currentPass: string; password: string }
  ) {
    const { currentPass, password } = body;
    const user = await this.getOne({ _id: id }, { password: 1 });
    if (!user) {
      throw generateErrorObject(404, "User not found");
    }
    const comparePassword = await bcrypt.compare(currentPass, user.password);
    if (!comparePassword) {
      throw generateErrorObject(401, "Current password is invalid.");
    }
    return this.updateOne({ _id: id }, { password });
  }
}

export default new AuthService();
