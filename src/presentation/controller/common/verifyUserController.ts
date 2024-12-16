import { NextFunction, Request, Response } from "express";
import { IotpVerification } from "../../../application/interfaces/Iotp";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { BadRequest, GoneError, InternalServerError } from "@buxlo/common";

export class OtpVerifyController {
  constructor(private verifyUserUseCase: IotpVerification) {}

  verify = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { otp, email } = req.body;
      const response = await this.verifyUserUseCase.execute({ otp, email });
      if (response.gone) {
        throw new GoneError(
          "OTP not found or has expired. try with currect otp"
        );
      }
      if (response.incorrect) {
        throw new BadRequest("Invalid OTP provided. Try with currect otp");
      }
      if (response.unverifiedUser) {
        throw new GoneError(
          "No user found restart the sign up process onese more"
        );
      }
      if (response.success) {
        res.cookie("userAccessToken", response.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie("userRefreshToken", response.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(HttpStatusCode.OK).json({ user: response.user });
      }
      else{
        throw new InternalServerError();
      }
    } catch (err) {
      console.error("Error in OTP verification controller:", err);
      next(err);
    }
  };
}
