import { Request, Response } from "express";
import authService from "@src/services/auth.service";
import { manageError } from "@src/helper/response.helper";
import { generateOTP } from "@src/util/util";
import emailService from "@src/services/email.service";
const optLength = 8;
class Controller {
  async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.generateResponse(res, "", 400, "Missing required fields");
        return;
      }
      const token = await authService.login(req.body);
      res.generateResponse(res, { token }, 200, "User logged in successfully!");
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }

  async signup(req: Request, res: Response): Promise<any> {
    try {
      const { email, password, firstName, lastName } = req.body;
      if (!email || !password || !lastName || !firstName) {
        res.generateResponse(res, "", 400, "Missing required fields");
        return;
      }
      const userData = await authService.getOne({ email });
      if (userData) {
        res.generateResponse(res, "", 400, "Email alredy exists");
        return;
      }
      const otp = generateOTP(optLength);
      await authService.createOTP({ email, otp, userData: req.body });
      const payload = {
        email,
        id: 2,
        params: { OTP: otp },
      };
      await emailService.sendEmail(payload);
      res.generateResponse(
        res,
        { otp },
        200,
        "Please check your email address."
      );
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }

  async recoverAccount(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;
      if (!email) {
        res.generateResponse(res, "", 400, "Missing required fields");
        return;
      }
      const userData = await authService.getOne(
        { email },
        { email: 1, isSocialLogin: 1 }
      );
      if (!userData) {
        res.generateResponse(res, "", 404, "Account not found");
        return;
      }
      if (userData.isSocialLogin) {
        res.generateResponse(res, "", 404, "Social Account");
        return;
      }
      const otp = generateOTP(optLength);
      await authService.createOTP({ email, otp });
      const payload = {
        email,
        id: 2,
        params: { OTP: otp },
      };
      await emailService.sendEmail(payload);
      res.generateResponse(
        res,
        { otp },
        200,
        "Please check your email address."
      );
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<any> {
    try {
      const { otp, email, verificationMode } = req.body;
      if (!otp || !email || !verificationMode) {
        res.generateResponse(res, "", 400, "Missing required fields");
        return;
      }
      const data = await authService.verifyOtp(req.body);
      if (data?.isNewUser) {
        res.generateResponse(
          res,
          {},
          200,
          "Account successfully created. You can login now."
        );
        return;
      }
      if (data?.isAccRecovery) {
        res.generateResponse(
          res,
          { token: data.token },
          200,
          "OTP verified. You can now reset password."
        );
        return;
      }
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }

  async changePassword(req: Request, res: Response): Promise<any> {
    try {
      const { password } = req.body;
      if (!password) {
        res.generateResponse(res, "", 400, "Missing required fields");
        return;
      }
      const data = await authService.updateOne({ _id: req.user._id }, req.body);
      res.generateResponse(res, data, 200, "Password reset successfully.");
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }
  // async changePassword(req: Request, res: Response): Promise<any> {
  //   try {
  //     const { currentPass, password } = req.body;
  //     if (!password || !currentPass) {
  //       res.generateResponse(res, "", 400, "Missing required fields");
  //       return;
  //     }
  //     const data = await authService.changePassword(req.user._id, req.body);
  //     res.generateResponse(res, data, 200, "Password changed successfully.");
  //   } catch (error) {
  //     const err = manageError(error);
  //     res.generateResponse(res, "", err.code, err.message);
  //   }
  // }

  async authMe(req: Request, res: Response): Promise<any> {
    try {
      res.generateResponse(
        res,
        req.user,
        200,
        "Logged in user fetched successfully."
      );
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }

  async socialLogin(req: Request, res: Response): Promise<any> {
    try {
      const { access_token } = req.body as { access_token: string };
      if (!access_token) {
        res.generateResponse(res, "", 400, "Missing required field");
        return;
      }
      const resp = await authService.socialLogin(access_token);
      res.generateResponse(
        res,
        { token: resp },
        200,
        "Social login successful."
      );
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }
  async updateUser(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body;
      if (!name) {
        res.generateResponse(res, "", 400, "Missing required field");
        return;
      }
      const resp = await authService.updateOne({ _id: req.user._id }, req.body);
      res.generateResponse(res, {}, 200, "Profile updated successfully.");
    } catch (error) {
      const err = manageError(error);
      res.generateResponse(res, "", err.code, err.message);
    }
  }
}

export default new Controller();
