import { User } from "../../../domain/entities/User";
import { IredisRepository } from "../../../domain/interfaces/IcacheUserRepo";
import { IOtpService, IresendOtpUseCase } from "../../interfaces/Iotp";

export class ResendOtpUseCase implements IresendOtpUseCase {
  constructor(
    private redisRepository: IredisRepository,
    private otpService: IOtpService
  ) {}
  async execute(user: Pick<User, "email">): Promise<string | void> {
    try {
      const isUnverifide = await this.redisRepository.getUnverifiedUser(
        user.email
      );
      if (!isUnverifide) {
        throw new Error("Email not fountd");
      }

      const otp = this.otpService.generateOtp(); // Generating new otp
      await this.redisRepository.storeOtp(user.email, otp); // store new otp to redis

      return otp;
    } catch (err) {
      console.error("Error from generating otp : ", err);
    }
  }
}
