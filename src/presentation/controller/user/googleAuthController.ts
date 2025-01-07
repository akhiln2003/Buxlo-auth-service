import { NextFunction, Request, Response } from "express";
import { IgoogleAuthUseCase } from "../../../application/interfaces/IgoogleAuthUseCase";
import { USER_ROLE } from "../../../shared/enums/role";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { IsetTokensUseCase } from "../../../application/interfaces/IsetTokensUseCase";
import { registerUser } from "../../../infrastructure/rpc/grpc/client";

export class GoogleAuthController {
  constructor(
    private googleAuthUseCase: IgoogleAuthUseCase,
    private setTokensUseCase: IsetTokensUseCase
  ) {}

  auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      // console.log("token" , token);
      const role = USER_ROLE.USER;
      const response = await this.googleAuthUseCase.execute(token, role);
      if (response.success) {
        await registerUser({
          id: response.user!.id,
          name: response.user!.name,
          email: response.user!.email,
          avatar: response.user!.avatar,
          role: response.user!.role,
          isGoogle: response.user!.isGoogle,
        });
        this.setTokensUseCase.execute(
          res,
          response.accessToken as string,
          response.refreshToken as string
        );
        res.status(HttpStatusCode.OK).json({ user: response.user });
      } else {
        res
          .status(HttpStatusCode.BadRequest)
          .json({ message: response.message });
      }
    } catch (error) {
      console.error("Error in OTP verification controller:", error);
      next(error);
    }
  };
}
