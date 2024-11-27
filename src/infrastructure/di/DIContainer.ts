import { OTPService } from "../../application/services/OTPService";
import { GetUser } from "../../application/usecases/user/getUser";
import { RegisterUserTemporarily } from "../../application/usecases/user/registerUserTemporarily";
import { SendOtpEmailUseCase } from "../../application/usecases/user/sendOtpEmail";
import { NodeMailerService } from "../external-services/nodeMailerService";
import { RedisUserRepository } from "../repositories/CacheUserRepo";
import { UserRepository } from "../repositories/UserRepository";


class DIContainer {
    private static _authRepository = new UserRepository();
    private static _rediseService = new RedisUserRepository();
    private static _otpService = new OTPService()
    private static _nodeMailerService = new NodeMailerService();


    

   

    static getUserUseCase() {        
        return new GetUser(this._authRepository)
    }

    static getTemporaryStorUseCase() {
        return new RegisterUserTemporarily(this._rediseService, this._otpService)
    }
    static getEmailServiceUseCase(){
        return new SendOtpEmailUseCase(this._nodeMailerService)
    }

}




export { DIContainer }