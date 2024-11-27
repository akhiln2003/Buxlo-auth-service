import { IemailService, SendOtpEmailInput } from "../../interfaces/IemailService";




export class SendOtpEmailUseCase {
    constructor(private emailService: IemailService) { }

    async execute(input: SendOtpEmailInput): Promise<void | boolean> {
        try {
            const subject = "Your OTP Code";
            const body = `
<body style="font-family: 'Arial', sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border: 1px solid #eaeaea;">
        <!-- Header Section -->
        <div style="background-color: #0052cc; color: #ffffff; text-align: center; padding: 20px;">
            <img src="https://via.placeholder.com/150x40?text=Your+Logo" alt="Your Company Logo" style="height: 40px;">
        </div>
        <!-- Content Section -->
        <div style="padding: 20px; text-align: center; color: #333333;">
            <h1 style="font-size: 22px; margin: 20px 0; color: #0052cc;">Your One-Time Password (OTP)</h1>
            <p style="font-size: 16px; line-height: 1.5; margin: 15px 0;">Hi <strong>${input.name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.5; margin: 15px 0;">Use the OTP below to complete your verification process. This code is valid for <strong>10 minutes</strong>.</p>
            <div style="display: inline-block; padding: 15px 25px; font-size: 24px; font-weight: bold; color: #333333; background-color: #f0f0f0; border: 1px ; border-radius: 5px; margin: 20px 0;">${input.otp}</div>
            <p style="font-size: 16px; line-height: 1.5; margin: 15px 0;">Do not share this code with anyone. Our support team will never ask for your verification code.</p>
            <div style="margin: 30px 0;">
                <a href="https://yourwebsite.com" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #0052cc; text-decoration: none; border-radius: 5px; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);">Go to Website</a>
            </div>
        </div>
        <!-- Footer Section -->
        <div style="font-size: 12px; color: #888888; text-align: center; padding: 20px; background-color: #f9f9f9;">
            © 2024 BUXLO. All rights reserved. <br>
            Read our <a href="#" style="color: #0052cc; text-decoration: none;">Privacy Policy</a> | <a href="#" style="color: #0052cc; text-decoration: none;">Terms of Use</a>
        </div>
    </div>
</body>
`
            await this.emailService.sendMail(input.email, subject, body);
            return true
        } catch (error) {
            console.log(error);
            return true
        }
    }
}