import { User } from "../../../domin/entities/User";
import { IredisRepository } from "../../../domin/interfaces/IcacheUserRepo";
import { ItokenService } from "../../../domin/interfaces/ItokenService";
import { IuserRepository } from "../../../domin/interfaces/IuserRepository";
import {
  IotpVerification,
  IotpVerificationParams,
  IotpVerificationResponse
} from "../../interfaces/Iotp";

export class OtpVerification implements IotpVerification {
  constructor(
    private redisRepository: IredisRepository,
    private userRepository: IuserRepository,
    private jwtservice: ItokenService
  ) {}

  async execute({
    otp,
    email
  }: IotpVerificationParams): Promise<IotpVerificationResponse> {
    try {
      const storedOTP = await this.redisRepository.getOtp(email); // finding otp from redis stor
      if (!storedOTP)
        return {
          success: false,
          message: "OTP not found or has expired. try with currect otp"
        };

      if (otp != storedOTP)
        return {
          success: false,
          message: "Invalid OTP provided. Try with currect otp"
        };

      const unverifiedUser = await this.redisRepository.getUnverifiedUser(
        email
      ); // finding unverified user from redis

      if (!unverifiedUser)
        return {
          success: false,
          message: "No user found restart the sign up process onese more"
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
    } catch (err) {
      console.error("Error from OTP varification : ", err);
      return { success: false, message: "Internal server error" };
    }
  }
}
