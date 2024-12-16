import { NextFunction, Request, Response } from "express-serve-static-core";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { IsendOtpEmailUseCase } from "../../../application/interfaces/IemailService";
import { IresendOtpUseCase } from "../../../application/interfaces/Iotp";

export class ResendOtpController {
  constructor(
    private sendEmailServiceUseCase: IsendOtpEmailUseCase,
    private resendOtpUseCase: IresendOtpUseCase
  ) {}

  resend = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body;

      const otp = (await this.resendOtpUseCase.execute({ email })) as string; // regnerating otp
      await this.sendEmailServiceUseCase.execute({ email, name, otp }); // sending otp to email
      console.log("Your OTP is: ", otp);

      res.status(HttpStatusCode.OK).json({
        message: "OTP has been resent to your email. Please check your inbox.",
      });
    } catch (err) {
      console.error("Error from resend Otp : ", err);
      next(err);
    }
  };
}
