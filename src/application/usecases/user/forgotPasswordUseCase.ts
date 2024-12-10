import { ItokenService } from "../../../domin/interfaces/ItokenService";
import { IuserRepository } from "../../../domin/interfaces/IuserRepository";
import { IemailService } from "../../interfaces/IemailService";
import { IforgotPassword } from "../../interfaces/IforgotPassword";

export class ForgotPasswordUseCase implements IforgotPassword {
  constructor(
    private userRepositary: IuserRepository,
    private emailService: IemailService,
    private jwtservice: ItokenService
  ) {}
  async execute(email: string): Promise<any> {
    try {
      const user = await this.userRepositary.findByEmail(email);
      if (!user) {
        return {
          notfount: true,
        };
      }
      const token = this.jwtservice.generateResentPasswordToken(user);
      const resetPasswordUrl = `${process.env.FORGOT_PASSWORD_FRONTEND_BASE_URL}?token=${token}`;
      return { resetPasswordUrl , user };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
}
