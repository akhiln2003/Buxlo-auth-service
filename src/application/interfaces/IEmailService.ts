export interface ISendOtpEmailUseCase {
  execute(input: ISendOtpEmailInput): Promise<void | boolean>;
}

export interface ISendForgotPasswordEmailUseCase{
  execute(input: ISendForgotPasswordEmailInput): Promise<void | boolean>;
}

export interface IEmailService {
  sendMail(to: string, subject: string, body: string): Promise<void>;
}


// for otp
export interface ISendOtpEmailInput {
  email: string;
  name: string;
  otp: string;
}



// for forgotPassword link
export interface ISendForgotPasswordEmailInput {
  email: string;
  name: string;
  link: string;
}