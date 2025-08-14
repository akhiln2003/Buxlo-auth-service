import {
  IemailService,
  IsendForgotPasswordEmailInput,
  IsendForgotPasswordEmailUseCase,
} from "../../interfaces/IemailService";

export class SendForgotPasswordEmailUseCase
  implements IsendForgotPasswordEmailUseCase
{
  constructor(private _emailService: IemailService) {}

  async execute(input: IsendForgotPasswordEmailInput): Promise<void | boolean> {
    try {
      const subject = "Your forgot Password link";
      const body = `<body style="margin: 0; padding: 0; font-family: 'Amazon Ember', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #f0f0f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #232f3e; color: #fff; padding: 30px; text-align: center;">
            <img src="https://via.placeholder.com/200x50" alt="Buxlo Logo" style="max-width: 200px; margin-bottom: 20px;">
        </div>
        <div style="padding: 30px;">
            <h2 style="color: #232f3e; font-size: 24px; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">We received a request to reset the password for your Buxlo account. If you made this request, please click the button below to reset your password:</p>
            <a href="${input.link}" style="display: inline-block; background-color: #ff9900; color: #232f3e; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-size: 16px; font-weight: bold; transition: background-color 0.3s ease;">Reset Password</a>
            <p style="font-size: 16px; line-height: 1.5; margin-top: 30px;">If you did not request a password reset, please ignore this email. This link will expire in 15 minutes.</p>
        </div>
        <div style="background-color: #232f3e; color: #fff; padding: 20px; text-align: center; font-size: 14px;">&copy; 2023 Buxlo. All rights reserved.</div>
    </div>
</body>
`;
      await this._emailService.sendMail(input.email, subject, body);
      return true;
    } catch (error) {
      console.error(error);
      return true;
    }
  }
}
