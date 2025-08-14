import { NotAuthorizedError } from "@buxlo/common";
import { NextFunction, Request, Response } from "express";
import { IauthTokenUseCase } from "../../../application/interfaces/IauthTokenUseCase";
import { IsetTokensUseCase } from "../../../application/interfaces/IsetTokensUseCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class RefresgTokenController {
  constructor(
    private _authTokenUseCase: IauthTokenUseCase,
    private _setTokensUseCase: IsetTokensUseCase
  ) {}
  validate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.userRefreshToken;
      if (!refreshToken) {
        throw new NotAuthorizedError();
      }
      const val = await this._authTokenUseCase.execute(refreshToken);
      if (val.notAuth) throw new NotAuthorizedError();
      this._setTokensUseCase.execute(res, val.accessToken);
      res
        .status(HttpStatusCode.OK)
        .json({ message: "Tokens refreshed successfully." });
    } catch (error) {
      next(error);
    }
  };
}
