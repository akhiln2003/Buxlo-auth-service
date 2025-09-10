import { ITokenService } from "../../../domain/interfaces/ITokenService";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserMapper } from "../../../domain/zodSchemaDto/output/userResponseDto";
import { USER_ROLE } from "../../../shared/enums/role";
import {
  IForgotPassword,
  ForgotPasswordResult,
} from "../../interfaces/IForgotPassword";

export class ForgotPasswordUseCase implements IForgotPassword {
  constructor(
    private _userRepositary: IUserRepository,
    private _jwtservice: ITokenService
  ) {}

  async execute(email: string, role: string): Promise<ForgotPasswordResult> {
    try {
      const user = await this._userRepositary.findOne({ email, role });
      if (!user) {
        return { type: "notFound" };
      }

      const token = this._jwtservice.generateResentPasswordToken(user);
      const resetPasswordUrl = `${process.env.FORGOT_PASSWORD_FRONTEND_BASE_URL}${
        role === USER_ROLE.MENTOR ? "mentor/" : ""
      }resetpassword/${token}`;

      const userResponseData = UserMapper.toDto(user);
      return { type: "success", resetPasswordUrl, user: userResponseData };
    } catch (error) {
      return { type: "error", error };
    }
  }
}
