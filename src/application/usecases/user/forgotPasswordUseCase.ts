import { ITokenService } from "../../../domain/interfaces/ITokenService";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { USER_ROLE } from "../../../shared/enums/role";
import { IForgotPassword } from "../../interfaces/IForgotPassword";

export class ForgotPasswordUseCase implements IForgotPassword {
  constructor(
    private _userRepositary: IUserRepository,
    private _jwtservice: ITokenService
  ) {}
  async execute(email: string, role: string): Promise<any> {
    try {
      const user = await this._userRepositary.findOne({ email, role });
      if (!user) {
        return {
          notfount: true,
        };
      }
      const token = this._jwtservice.generateResentPasswordToken(user);
      const resetPasswordUrl = `${process.env.FORGOT_PASSWORD_FRONTEND_BASE_URL}${role == USER_ROLE.MENTOR ? "mentor/" : ""}resetpassword/${token}`;
      return { resetPasswordUrl, user };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
}
