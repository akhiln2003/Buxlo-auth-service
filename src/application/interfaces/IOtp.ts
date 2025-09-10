import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponse.dto";

export interface IOtpService {
  generateOtp(): string;
}

export interface IOtpVerification {
  execute({
    otp,
    email,
  }: IOtpVerificationParams): Promise<IOtpVerificationResponse>;
}

export interface IOtpVerificationParams {
  otp: string;
  email: string;
}

export interface IOtpVerificationResponse {
  success?: boolean;
  gone?: boolean;
  incorrect?: boolean;
  unverifiedUser?: boolean;
  InternalServer?: boolean;
  error?: any;
  user?: UserResponseDto | null;
  refreshToken?: string;
  accessToken?: string;
}

export interface IresendOtpUseCase {
  execute(email: string): Promise<string | void>;
}
