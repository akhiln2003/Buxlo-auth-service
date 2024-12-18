import { NextFunction, Request, Response } from "express-serve-static-core";
import { IgetUser } from "../../../application/interfaces/IgetUser";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { IregisterUserTemporarily } from "../../../application/interfaces/IregisterUserTemporarily";
import { USER_ROLE } from "../../../shared/enums/role";
import { IsendOtpEmailUseCase } from "../../../application/interfaces/IemailService";
import { ConflictError } from "@buxlo/common";

export class SignUpController {
  constructor(
    private getUserUseCase: IgetUser,
    private temporaryStoreAndOtpUseCase: IregisterUserTemporarily,
    private sendOtpEmailUseCase: IsendOtpEmailUseCase
  ) {}

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name, avatar } = req.body;
      const role = USER_ROLE.MENTOR;
      // Check if user exists
      const userExist = await this.getUserUseCase.execute({ email, role });
      
      if (userExist) {
       throw new ConflictError("User already exist with this email");
      }

      // Store user temporarily and generate OTP
      const otp = (await this.temporaryStoreAndOtpUseCase.execute({
        name,
        email,
        password,
        avatar,
        role: USER_ROLE.MENTOR,
      })) as string;

      // Send OTP via email
      await this.sendOtpEmailUseCase.execute({ email, name, otp });
      console.log("Your OTP is: ", otp);
      res
        .status(HttpStatusCode.OK)
        .json({ message: "OTP sent to email.", email });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
