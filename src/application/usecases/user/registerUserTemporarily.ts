import { User } from "../../../domin/entities/User";
import { IredisRepository } from "../../../domin/interfaces/ICacheUserRepo";
import { IOtpService } from "../../interfaces/IOtpService";
import { Password } from "../../services/passwordHash";

export class RegisterUserTemporarily {

    constructor(private redisRepository: IredisRepository,
        private otpService: IOtpService
    ) { };

    async execute(user: Pick<User, 'avatar' | 'email' | 'name' | 'password'> ):Promise<string | void>  {
        try {
            let hashPassword = await Password.toHash(user.password) as string;
            await this.redisRepository.saveUnverifiedUser(user.email, {
                ...user,
                password: hashPassword
            });

            const otp = this.otpService.generateOtp();
            await this.redisRepository.storeOtp(user.email, otp);
            return otp
        } catch (err) {

        }
    }
}