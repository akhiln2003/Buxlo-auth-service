import { User } from "../../domain/entities/User";
import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponseDto";

export interface IOtpService {
  generateOtp(): string;
}

export interface IOtpVerification {
  execute({
    otp,
    email
  }: IOtpVerificationParams): Promise<IOtpVerificationResponse>;
}

export interface IOtpVerificationParams {
  otp: string;
  email: string;
}

export interface IOtpVerificationResponse {
  success?: boolean;
  gone?: boolean;
  incorrect?:boolean;
  unverifiedUser?:boolean;
  InternalServer?: boolean;
  error?: any;
  user?: UserResponseDto | null;
  refreshToken?: string;
  accessToken?: string;
}

export interface IresendOtpUseCase {
  execute(user: Pick<User, "email">): Promise<string | void>;
}
