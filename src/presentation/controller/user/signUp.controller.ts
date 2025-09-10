import { NextFunction, Request, Response } from "express";
import { IGetUser } from "../../../application/interfaces/IGetUser";
import { IRegisterUserTemporarily } from "../../../application/interfaces/IRegisterUserTemporarily";
import { ISendOtpEmailUseCase } from "../../../application/interfaces/IEmailService";
import { USER_ROLE } from "../../../shared/enums/role";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { ConflictError } from "@buxlo/common";

export class SignUpController {
  constructor(
    private _getUserUseCase: IGetUser,
    private _temporaryStoreAndOtpUseCase: IRegisterUserTemporarily,
    private _sendOtpEmailUseCase: ISendOtpEmailUseCase
  ) {}
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name, avatar } = req.body;
      const role = USER_ROLE.USER;

      // Check if user exists
      const userExist = await this._getUserUseCase.execute({ email, role });

      if (userExist) {
        throw new ConflictError("User already exist with this email");
      }

      // Store user temporarily and generate OTP
      const otp = (await this._temporaryStoreAndOtpUseCase.execute({
        name,
        email,
        password,
        avatar,
        role: USER_ROLE.USER,
      })) as string;

      // Send OTP via email
      await this._sendOtpEmailUseCase.execute({ email, name, otp });
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
