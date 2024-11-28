import { IsendOtpEmailUseCase } from "../../application/interfaces/IemailService";
import { IgetUser } from "../../application/interfaces/IgetUser";
import { IotpVerification } from "../../application/interfaces/Iotp";
import { IregisterUserTemporarily } from "../../application/interfaces/IregisterUserTemporarily";
import { OTPService } from "../../application/services/OTPService";
import { GetUser } from "../../application/usecases/user/getUser";
import { OtpVerification } from "../../application/usecases/user/otpVerification";
import { RegisterUserTemporarily } from "../../application/usecases/user/registerUserTemporarily";
import { SendOtpEmailUseCase } from "../../application/usecases/user/sendOtpEmail";
import { JwtService } from "../external-services/JwtService";
import { NodeMailerService } from "../external-services/nodeMailerService";
import { RedisUserRepository } from "../repositories/cacheUserRepo";
import { UserRepository } from "../repositories/userRepository";


class DIContainer {
    private _authRepository: UserRepository;
    private _rediseService: RedisUserRepository;
    private _otpService: OTPService;
    private _nodeMailerService: NodeMailerService;
    private __jwtService: JwtService

    constructor() {
        this._authRepository = new UserRepository();
        this._rediseService = new RedisUserRepository();
        this._otpService = new OTPService();
        this._nodeMailerService = new NodeMailerService()
        this.__jwtService = new JwtService()
    }

    



    getUserUseCase():IgetUser{
        return new GetUser(this._authRepository)
    }

    getTemporaryStoreUseCase():IregisterUserTemporarily {
        return new RegisterUserTemporarily(this._rediseService, this._otpService)
    }
    getEmailServiceUseCase(): IsendOtpEmailUseCase {
        return new SendOtpEmailUseCase(this._nodeMailerService)
    }
    verifyUserUseCase(): IotpVerification{
        return new OtpVerification(this._rediseService , this._authRepository , this.__jwtService);
    }

}




export { DIContainer }