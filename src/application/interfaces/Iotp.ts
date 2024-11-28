import { User } from "../../domin/entities/User";

export interface IotpVerification {
    execute({ otp, email }: IotpVerificationParams): Promise<IotpVerificationResponse>
}



export interface IOtpService {
    generateOtp(): string;
}

export interface IotpVerificationParams {
    otp: string;
    email: string
}

export interface IotpVerificationResponse {
    success: boolean;
    user?: User | null;
    message?: string;
    refreshToken?: string;
    accessToken?: string
}