import { NextFunction, Request, Response } from "express";
import { IgoogleAuthUseCase } from "../../../application/interfaces/IgoogleAuthUseCase";
import { USER_ROLE } from "../../../shared/enums/role";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { BadRequest, InternalServerError } from "@buxlo/common";

export class GoogleAuthController {
  constructor(private googleAuthUseCase: IgoogleAuthUseCase) {}

  auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      // console.log("token" , token);
      const role = USER_ROLE.MENTOR;
      const response = await this.googleAuthUseCase.execute(token, role);
      if( response.validat ){
        throw new BadRequest("validation faild please try again");
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
      } else {
        throw new InternalServerError();
      }
    } catch (error) {
      console.error("Error in OTP verification controller:", error);
      next(error);
    }
  };
}
