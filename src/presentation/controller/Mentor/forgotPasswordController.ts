import { NextFunction, Request, Response } from "express";
import { NotFountError } from "@buxlo/common";
import { IForgotPassword } from "../../../application/interfaces/IForgotPassword";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { ISendForgotPasswordEmailUseCase } from "../../../application/interfaces/IEmailService";
import { USER_ROLE } from "../../../shared/enums/role";

export class ForgotPasswordController {
  constructor(
    private _forgotPasswordUseCase: IForgotPassword,
    private _sendEmailServiceUseCase: ISendForgotPasswordEmailUseCase
  ) {}
  forgot = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const role = USER_ROLE.MENTOR;
      const response = await this._forgotPasswordUseCase.execute(email, role);
      if (response?.notfount) {
        throw new NotFountError("This email is invalid");
      }
      if (response?.resetPasswordUrl) {
        await this._sendEmailServiceUseCase.execute({
          email: response.user.email,
          name: response.user.name,
          link: response.resetPasswordUrl,
        }); // sending otp to email
        res.status(HttpStatusCode.OK).json({
          message:
            "Password reset link sent succesfully. Please check your email!",
        });
      }
      if (response?.error) {
        res
          .status(HttpStatusCode.InternalServerError)
          .json({ error: response.error });
      }
    } catch (error) {
      next(error);
    }
  };
}
