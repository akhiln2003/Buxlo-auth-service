import { NextFunction, Request, Response } from "express";
import { NotFountError } from "@buxlo/common";
import { IforgotPassword } from "../../../application/interfaces/IforgotPassword";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { IsendForgotPasswordEmailUseCase } from "../../../application/interfaces/IemailService";

export class ForgotPassword {
  constructor(private forgotPasswordUseCase: IforgotPassword,
  private sendEmailServiceUseCase: IsendForgotPasswordEmailUseCase
  ) {}
  forgot = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const response = await this.forgotPasswordUseCase.execute(email);
      if (response?.notfount) {
        throw new NotFountError("This email is invalid");
      }
      if (response?.resetPasswordUrl) {
        
        await this.sendEmailServiceUseCase.execute({ email: response.user.email, name: response.user.name, link: response.resetPasswordUrl }); // sending otp to email
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
