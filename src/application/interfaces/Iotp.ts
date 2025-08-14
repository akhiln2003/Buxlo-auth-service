import { User } from "../../domain/entities/User";
import { UserResponseDto } from "../../zodSchemaDto/output/userResponseDto";

export interface IOtpService {
  generateOtp(): string;
}

export interface IotpVerification {
  execute({
    otp,
    email
  }: IotpVerificationParams): Promise<IotpVerificationResponse>;
}

export interface IotpVerificationParams {
  otp: string;
  email: string;
}

export interface IotpVerificationResponse {
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
