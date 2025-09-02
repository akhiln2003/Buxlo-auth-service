import { User } from "../../../domain/entities/User";
import { IRedisRepository } from "../../../domain/interfaces/ICacheUserRepo";
import { IOtpService, IresendOtpUseCase } from "../../interfaces/IOtp";

export class ResendOtpUseCase implements IresendOtpUseCase {
  constructor(
    private _redisRepository: IRedisRepository,
    private _otpService: IOtpService
  ) {}
  async execute(user: Pick<User, "email">): Promise<string | void> {
    try {
      const isUnverifide = await this._redisRepository.getUnverifiedUser(
        user.email
      );
      if (!isUnverifide) {
        throw new Error("Email not fountd");
      }

      const otp = this._otpService.generateOtp(); // Generating new otp
      await this._redisRepository.storeOtp(user.email, otp); // store new otp to redis

      return otp;
    } catch (err) {
      console.error("Error from generating otp : ", err);
    }
  }
}
