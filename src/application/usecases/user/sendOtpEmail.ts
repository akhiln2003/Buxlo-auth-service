import {
  IemailService,
  IsendOtpEmailInput,
  IsendOtpEmailUseCase
} from "../../interfaces/IemailService";

export class SendOtpEmailUseCase implements IsendOtpEmailUseCase {
  constructor(private emailService: IemailService) {}

  async execute(input: IsendOtpEmailInput): Promise<void | boolean> {
    try {
      const subject = "Your OTP Code";
      const body = `<body style="margin: 0; padding: 0; font-family: 'Amazon Ember', Arial, sans-serif;">
                                <div style="max-width: 600px; margin: 0 auto; background-color: #f0f0f0; border-radius: 8px; overflow: hidden;">
                                    <div style="background-color: #232f3e; color: #fff; padding: 40px; text-align: center;">
                                        <img src="https://via.placeholder.com/200x50" alt="Buxlo Logo" style="max-width: 200px; margin-bottom: 20px;">
                                    </div>
                                    <div style="padding: 40px;">
                                        <h2 style="color: #232f3e; font-size: 24px; margin-bottom: 20px;">Your Verification Code</h2>
                                        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">To verify your email address, please enter the following code on the Buxlo website:</p>
                                        <div style="display: block; background-color: #fff; padding: 20px; font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 30px; border: 1px solid #ddd; border-radius: 4px;">${input.otp}</div>
                                        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">This code is valid for the next 15 minutes. If you did not request this verification, please ignore this email.</p>
                                        <a href="#" style="display: inline-block; background-color: #ff9900; color: #232f3e; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-size: 16px; font-weight: bold; transition: background-color 0.3s ease;">Complete Registration</a>
                                    </div>
                                    <div style="background-color: #232f3e; color: #fff; padding: 20px; text-align: center; font-size: 14px;">&copy; 2023 Buxlo. All rights reserved.</div>
                                </div>
                            </body>`;
      await this.emailService.sendMail(input.email, subject, body);
      return true;
    } catch (error) {
      console.error(error);
      return true;
    }
  }
}
