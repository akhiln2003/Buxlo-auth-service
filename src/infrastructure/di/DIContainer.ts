import { OTPService } from "../../application/services/OTPService";
import { GetUser } from "../../application/usecases/user/getUser";
import { RegisterUserTemporarily } from "../../application/usecases/user/registerUserTemporarily";
import { SendOtpEmailUseCase } from "../../application/usecases/user/sendOtpEmail";
import { NodeMailerService } from "../external-services/nodeMailerService";
import { RedisUserRepository } from "../repositories/CacheUserRepo";
import { UserRepository } from "../repositories/UserRepository";


class DIContainer {
    private _authRepository: UserRepository;
    private _rediseService: RedisUserRepository;
    private _otpService: OTPService;
    private _nodeMailerService: NodeMailerService;

    constructor() {
        this._authRepository = new UserRepository();
        this._rediseService = new RedisUserRepository();
        this._otpService = new OTPService();
        this._nodeMailerService = new NodeMailerService()
    }




    getUserUseCase() {
        return new GetUser(this._authRepository)
    }

    getTemporaryStoreUseCase() {
        return new RegisterUserTemporarily(this._rediseService, this._otpService)
    }
    getEmailServiceUseCase() {
        return new SendOtpEmailUseCase(this._nodeMailerService)
    }

}




export { DIContainer }