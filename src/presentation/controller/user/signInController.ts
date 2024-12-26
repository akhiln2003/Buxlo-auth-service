import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { IsignInUserUseCase } from "../../../application/interfaces/IsignInUserUseCase";
import { USER_ROLE } from "../../../shared/enums/role";
import { BlockError, NotAuthorizedError, NotFountError } from "@buxlo/common";
import { IsetTokensUseCase } from "../../../application/interfaces/IsetTokensUseCase";

export class SignInController {
  constructor(private signInUserUseCase: IsignInUserUseCase ,private setTokensUseCase:IsetTokensUseCase) {}

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const role = USER_ROLE.USER,
        isAdmin = false;
      const user = await this.signInUserUseCase.execute(
        email,
        password,
        role,
        isAdmin
      );

      // if the user not existing in db return response ( status code and message )
      if (user.notfount) {
        throw new NotFountError("This email is invalid");
      }
      // if the user password  nto matching db return response ( status code and message )
      if (user.passwordNotMatch) {
        throw new NotAuthorizedError(
          "Invalid credentials. Please check your password and try again."
        );
      }
      if (user.isBlocked) {
        throw new BlockError();
      }

      this.setTokensUseCase.execute(res,user.accessToken , user.refreshToken);
      res
        .status(HttpStatusCode.OK)
        .json({ message: "Login successful.", user: user.user });

      // await
    } catch (error) {
      console.error("Error in OTP verification controller:", error);
      next(error);
    }
  };
}
