import { NextFunction, Request, Response } from "express";
import { IOtpVerification } from "../../../application/interfaces/IOtp";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { BadRequest, GoneError, InternalServerError } from "@buxlo/common";
import { ISetTokensUseCase } from "../../../application/interfaces/ISetTokensUseCase";
import { registerUser } from "../../../infrastructure/rpc/grpc/client";

export class OtpVerifyController {
  constructor(
    private _verifyUserUseCase: IOtpVerification,
    private _setTokensUseCase: ISetTokensUseCase
  ) {}

  verify = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { otp, email } = req.body;
      const response = await this._verifyUserUseCase.execute({ otp, email });
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
        await registerUser({
          id: response.user!.id,
          email: response.user!.email,
          name: response.user!.name,
          role: response.user!.role,
          isGoogle: response.user!.isGoogle,
          avatar: response.user!.avatar,
        });
        this._setTokensUseCase.execute(
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
