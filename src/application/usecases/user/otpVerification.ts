import { User } from "../../../domain/entities/User";
import { IredisRepository } from "../../../domain/interfaces/IcacheUserRepo";
import { ItokenService } from "../../../domain/interfaces/ItokenService";
import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { UserMapper } from "../../../domain/zodSchemaDto/output/userResponseDto";
import { UserCreatedProducer } from "../../../infrastructure/MessageBroker/kafka/producer/userCreatedProducer";
import {
  IotpVerification,
  IotpVerificationParams,
  IotpVerificationResponse,
} from "../../interfaces/Iotp";

export class OtpVerification implements IotpVerification {
  constructor(
    private _redisRepository: IredisRepository,
    private _userRepository: IuserRepository,
    private _jwtservice: ItokenService,
    private _userCreatedProducer: UserCreatedProducer
  ) {}

  async execute({
    otp,
    email,
  }: IotpVerificationParams): Promise<IotpVerificationResponse> {
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
