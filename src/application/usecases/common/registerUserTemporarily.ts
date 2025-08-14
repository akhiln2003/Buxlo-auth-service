import { User } from "../../../domain/entities/User";
import { IredisRepository } from "../../../domain/interfaces/IcacheUserRepo";
import { IOtpService } from "../../interfaces/Iotp";
import { IregisterUserTemporarily } from "../../interfaces/IregisterUserTemporarily";
import { Password } from "../../services/passwordHash";

export class RegisterUserTemporarily implements IregisterUserTemporarily {
  constructor(
    private _redisRepository: IredisRepository,
    private _otpService: IOtpService
  ) {}

  async execute(
    user: Pick<User, "password" | "email" | "avatar" | "name" | "role">
  ): Promise<string | void> {
    try {
      const hashPassword = (await Password.toHash(user.password)) as string;
      await this._redisRepository.saveUnverifiedUser(user.email, {
        ...user,
        password: hashPassword
      });

      const otp = this._otpService.generateOtp();
      await this._redisRepository.storeOtp(user.email, otp);
      return otp;
    } catch (err) {
      console.error(err);
    }
  }
}
