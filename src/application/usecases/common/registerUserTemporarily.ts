import { IRedisRepository } from "../../../domain/interfaces/ICacheUserRepo";
import { IOtpService } from "../../interfaces/IOtp";
import {
  IRegisterUserTemporarily,
  IRegisterUserTemporarilyProps,
} from "../../interfaces/IRegisterUserTemporarily";
import { Password } from "../../services/passwordHash";

export class RegisterUserTemporarily implements IRegisterUserTemporarily {
  constructor(
    private _redisRepository: IRedisRepository,
    private _otpService: IOtpService
  ) {}

  async execute(user: IRegisterUserTemporarilyProps): Promise<string | void> {
    try {
      const hashPassword = (await Password.toHash(user.password)) as string;
      await this._redisRepository.saveUnverifiedUser(user.email, {
        ...user,
        password: hashPassword,
      });

      const otp = this._otpService.generateOtp();
      await this._redisRepository.storeOtp(user.email, otp);
      return otp;
    } catch (err) {
      console.error(err);
    }
  }
}
