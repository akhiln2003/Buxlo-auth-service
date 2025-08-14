import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { IsignInUserUseCase } from "../../../application/interfaces/IsignInUserUseCase";
import { USER_ROLE } from "../../../shared/enums/role";
import { IsetTokensUseCase } from "../../../application/interfaces/IsetTokensUseCase";

export class SignInController {
  constructor(
    private _signInUserUseCase: IsignInUserUseCase,
    private _setTokensUseCase: IsetTokensUseCase
  ) {}

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const role = USER_ROLE.ADMIN,
        isAdmin = true;
      const user = await this._signInUserUseCase.execute(
        email,
        password,
        role,
        isAdmin
      );

      this._setTokensUseCase.execute(res, user.accessToken, user.refreshToken);

      res
        .status(HttpStatusCode.OK)
        .json({ message: "Login successful.", user: user.user });

      // await
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
