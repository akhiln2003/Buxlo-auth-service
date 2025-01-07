import { User } from "../../../domain/entities/User";
import { IredisRepository } from "../../../domain/interfaces/IcacheUserRepo";
import { ItokenService } from "../../../domain/interfaces/ItokenService";
import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import {
  IotpVerification,
  IotpVerificationParams,
  IotpVerificationResponse,
} from "../../interfaces/Iotp";

export class OtpVerification implements IotpVerification {
  constructor(
    private redisRepository: IredisRepository,
    private userRepository: IuserRepository,
    private jwtservice: ItokenService
  ) {}

  async execute({
    otp,
    email,
  }: IotpVerificationParams): Promise<IotpVerificationResponse> {
    try {
      const storedOTP = await this.redisRepository.getOtp(email); // finding otp from redis stor
      if (!storedOTP)
        return {
          gone: true,
        };

      if (otp != storedOTP)
        return {
          incorrect: true,
        };

      const unverifiedUser =
        await this.redisRepository.getUnverifiedUser(email); // finding unverified user from redis

      if (!unverifiedUser)
        return {
          unverifiedUser: true,
        };

      // Creating new User
      const user = new User(
        unverifiedUser.name,
        unverifiedUser.email,
        unverifiedUser.password,
        unverifiedUser.role,
        unverifiedUser.isBlocked,
        unverifiedUser.avatar
      );

      const newUser = await this.userRepository.create(user); // Add new user in mongoDb
      await this.redisRepository.removeUnverifiedUser(email); // removing unverifiedUser from redis
      const accessToken = this.jwtservice.generateAccessToken(user); // generating access token
      const refreshToken = this.jwtservice.generateRefreshToken(user); // generating referesh token

      return { success: true, accessToken, refreshToken, user: newUser };
    } catch (error) {
      console.error("Error from OTP varification : ", error);
      return { InternalServer: true, error };
    }
  }
}
