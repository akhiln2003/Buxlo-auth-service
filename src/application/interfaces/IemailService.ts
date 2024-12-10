export interface IsendOtpEmailUseCase {
  execute(input: IsendOtpEmailInput): Promise<void | boolean>;
}

export interface IsendForgotPasswordEmailUseCase{
  execute(input: IsendForgotPasswordEmailInput): Promise<void | boolean>;
}

export interface IemailService {
  sendMail(to: string, subject: string, body: string): Promise<void>;
}


// for otp
export interface IsendOtpEmailInput {
  email: string;
  name: string;
  otp: string;
}



// for forgotPassword link
export interface IsendForgotPasswordEmailInput {
  email: string;
  name: string;
  link: string;
}