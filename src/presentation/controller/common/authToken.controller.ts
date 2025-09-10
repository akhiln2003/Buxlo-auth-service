import { NotAuthorizedError } from "@buxlo/common";
import { NextFunction, Request, Response } from "express";
import { IAuthTokenUseCase } from "../../../application/interfaces/IAuthTokenUseCase";
import { ISetTokensUseCase } from "../../../application/interfaces/ISetTokensUseCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class RefresgTokenController {
  constructor(
    private _authTokenUseCase: IAuthTokenUseCase,
    private _setTokensUseCase: ISetTokensUseCase
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
