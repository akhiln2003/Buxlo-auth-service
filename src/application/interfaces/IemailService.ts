export interface IsendOtpEmailUseCase {
  execute(input: IsendOtpEmailInput): Promise<void | boolean>;
}

export interface IemailService {
  sendMail(to: string, subject: string, body: string): Promise<void>;
}

export interface IsendOtpEmailInput {
  email: string;
  name: string;
  otp: string;
}
