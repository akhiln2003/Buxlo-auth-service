import { User } from "../../../domain/entities/User";
import { IRedisRepository } from "../../../domain/interfaces/ICacheUserRepo";
import { ITokenService } from "../../../domain/interfaces/ITokenService";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserMapper } from "../../../domain/zodSchemaDto/output/userResponseDto";
import { UserCreatedProducer } from "../../../infrastructure/MessageBroker/kafka/producer/userCreatedProducer";
import {
  IOtpVerification,
  IOtpVerificationParams,
  IOtpVerificationResponse,
} from "../../interfaces/IOtp";

export class OtpVerification implements IOtpVerification {
  constructor(
    private _redisRepository: IRedisRepository,
    private _userRepository: IUserRepository,
    private _jwtservice: ITokenService,
    private _userCreatedProducer: UserCreatedProducer
  ) {}

  async execute({
    otp,
    email,
  }: IOtpVerificationParams): Promise<IOtpVerificationResponse> {
    try {
      const storedOTP = await this._redisRepository.getOtp(email); // finding otp from redis stor
      if (!storedOTP)
        return {
          gone: true,
        };

      if (otp != storedOTP)
        return {
          incorrect: true,
        };

      const unverifiedUser =
        await this._redisRepository.getUnverifiedUser(email); // finding unverified user from redis

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
      const userData = await this._userRepository.create(user); // Add new user in mongoDb
      const newUser = UserMapper.toDto(userData);
      await this._redisRepository.removeUnverifiedUser(email); // removing unverifiedUser from redis
      const accessToken = this._jwtservice.generateAccessToken(user); // generating access token
      const refreshToken = this._jwtservice.generateRefreshToken(user); // generating referesh token

      const data = {
        id: newUser.id as string,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        isAdmin: newUser.isAdmin,
        isBlocked: newUser.isBlocked,
        isGoogle: newUser.isGoogle,
        role: newUser.role as "user" | "admin" | "mentor",
      };
      await this._userCreatedProducer.produce(data); // producing message to kafka
      return { success: true, accessToken, refreshToken, user: newUser };
    } catch (error) {
      console.error("Error from OTP varification : ", error);
      return { InternalServer: true, error };
    }
  }
}
