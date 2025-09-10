import { NextFunction, Request, Response } from "express";
import { IGoogleAuthUseCase } from "../../../application/interfaces/IGoogleAuthUseCase";
import { USER_ROLE } from "../../../shared/enums/role";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { ISetTokensUseCase } from "../../../application/interfaces/ISetTokensUseCase";
import { registerUser } from "../../../infrastructure/rpc/grpc/client";
import { BadRequest, BlockError, InternalServerError } from "@buxlo/common";

export class GoogleAuthController {
  constructor(
    private _googleAuthUseCase: IGoogleAuthUseCase,
    private _setTokensUseCase: ISetTokensUseCase
  ) {}

  auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const role = USER_ROLE.USER;
      const response = await this._googleAuthUseCase.execute(token, role);

      switch (response.type) {
        case "success":
          await registerUser({
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            avatar: response.user.avatar,
            role: response.user.role,
            isGoogle: response.user.isGoogle,
          });
          this._setTokensUseCase.execute(
            res,
            response.accessToken,
            response.refreshToken
          );
          res.status(HttpStatusCode.OK).json({ user: response.user });
          break;
        case "blocked":
          throw new BlockError();

        case "invalidToken":
          throw new BadRequest("Invalid Google token");

        case "error":
          throw new InternalServerError();
      }
    } catch (error) {
      console.error("Error in GoogleAuthController:", error);
      next(error);
    }
  };
}
