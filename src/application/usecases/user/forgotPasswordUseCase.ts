import { ItokenService } from "../../../domain/interfaces/ItokenService";
import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { USER_ROLE } from "../../../shared/enums/role";
import { IforgotPassword } from "../../interfaces/IforgotPassword";

export class ForgotPasswordUseCase implements IforgotPassword {
  constructor(
    private userRepositary: IuserRepository,
    private jwtservice: ItokenService
  ) {}
  async execute(email: string , role: string , ): Promise<any> {
    try {
      const user = await this.userRepositary.findOne({ email , role });
      if (!user) {
        return {
          notfount: true,
        };
      }
      const token = this.jwtservice.generateResentPasswordToken(user);
      const resetPasswordUrl = `${process.env.FORGOT_PASSWORD_FRONTEND_BASE_URL}${role == USER_ROLE.MENTOR  ? "mentor/" :""}resetpassword/${token}`;
      return { resetPasswordUrl , user };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
}
