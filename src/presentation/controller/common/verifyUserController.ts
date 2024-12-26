import { NextFunction, Request, Response } from "express";
import { IotpVerification } from "../../../application/interfaces/Iotp";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { BadRequest, GoneError, InternalServerError } from "@buxlo/common";
import { IsetTokensUseCase } from "../../../application/interfaces/IsetTokensUseCase";

export class OtpVerifyController {
  constructor(
    private verifyUserUseCase: IotpVerification,
    private setTokensUseCase: IsetTokensUseCase
  ) {}

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
        this.setTokensUseCase.execute(
          res,
          response.accessToken as string,
          response.refreshToken as string
        );

        res.status(HttpStatusCode.OK).json({ user: response.user });
      } else {
        throw new InternalServerError();
      }
    } catch (err) {
      console.error("Error in OTP verification controller:", err);
      next(err);
    }
  };
}
