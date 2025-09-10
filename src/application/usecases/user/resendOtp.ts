import { IRedisRepository } from "../../../domain/interfaces/ICacheUserRepo";
import { IOtpService, IresendOtpUseCase } from "../../interfaces/IOtp";

export class ResendOtpUseCase implements IresendOtpUseCase {
  constructor(
    private _redisRepository: IRedisRepository,
    private _otpService: IOtpService
  ) {}
  async execute(email:string): Promise<string | void> {
    try {
      const isUnverifide = await this._redisRepository.getUnverifiedUser(
        email
      );
      if (!isUnverifide) {
        throw new Error("Email not fountd");
      }

      const otp = this._otpService.generateOtp(); // Generating new otp
      await this._redisRepository.storeOtp(email, otp); // store new otp to redis

      return otp;
    } catch (err) {
      console.error("Error from generating otp : ", err);
    }
  }
}
