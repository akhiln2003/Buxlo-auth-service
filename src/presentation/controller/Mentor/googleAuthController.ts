import { NextFunction, Request, Response } from "express";
import { IgoogleAuthUseCase } from "../../../application/interfaces/IgoogleAuthUseCase";
import { USER_ROLE } from "../../../shared/enums/role";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { BadRequest, BlockError, InternalServerError } from "@buxlo/common";
import { IsetTokensUseCase } from "../../../application/interfaces/IsetTokensUseCase";
import { registerUser } from "../../../infrastructure/rpc/grpc/client";

export class GoogleAuthController {
  constructor(
    private _googleAuthUseCase: IgoogleAuthUseCase,
    private _setTokensUseCase: IsetTokensUseCase
  ) {}

  auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const role = USER_ROLE.MENTOR;
      const response = await this._googleAuthUseCase.execute(token, role);
      if (response.validat) {
        throw new BadRequest("validation faild please try again");
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
      }
      if (response.blocked) {
        throw new BlockError();
      } else {
        throw new InternalServerError();
      }
    } catch (error) {
      console.error("Error in OTP verification controller:", error);
      next(error);
    }
  };
}
