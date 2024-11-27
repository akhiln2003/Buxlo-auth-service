export interface IemailService {
    sendMail(to: string, subject: string, body: string): Promise<void>;
}


export interface SendOtpEmailInput{
    email: string;
    name: string;
    otp: string;
}