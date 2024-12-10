import { IsendForgotPasswordEmailUseCase, IsendOtpEmailUseCase } from "../../application/interfaces/IemailService";
import { IgetUser } from "../../application/interfaces/IgetUser";
import {
  IotpVerification,
  IresendOtpUseCase,
} from "../../application/interfaces/Iotp";
import { IregisterUserTemporarily } from "../../application/interfaces/IregisterUserTemporarily";
import { OTPService } from "../../application/services/OTPService";
import { OtpVerification } from "../../application/usecases/user/otpVerification";
import { RegisterUserTemporarily } from "../../application/usecases/common/registerUserTemporarily";
import { ResendOtpUseCase } from "../../application/usecases/user/resendOtp";
import { SendOtpEmailUseCase } from "../../application/usecases/user/sendOtpEmail";
import { JwtService } from "../external-services/JwtService";
import { NodeMailerService } from "../external-services/nodeMailerService";
import { RedisUserRepository } from "../repositories/cacheUserRepo";
import { UserRepository } from "../repositories/userRepository";
import { GetUserUseCase } from "../../application/usecases/user/getUser";
import { IsignInUserUseCase } from "../../application/interfaces/IsignInUserUseCase";
import { SignInUserUseCase } from "../../application/usecases/user/signInUser";
import { IforgotPassword } from "../../application/interfaces/IforgotPassword";
import { ForgotPasswordUseCase } from "../../application/usecases/user/forgotPasswordUseCase";
import { SendForgotPasswordEmailUseCase } from "../../application/usecases/user/sendForgotPasswodEmail";
import { SetNewPasswordUseCase } from "../../application/usecases/user/setNewPasswordUseCase";
import { IsetNewPasswordUseCase } from "../../application/interfaces/IsetNewPasswordUseCase";

class DIContainer {
  private _authRepository: UserRepository;
  private _rediseService: RedisUserRepository;
  private _otpService: OTPService;
  private _nodeMailerService: NodeMailerService;
  private __jwtService: JwtService;

  constructor() {
    this._authRepository = new UserRepository();
    this._rediseService = new RedisUserRepository();
    this._otpService = new OTPService();
    this._nodeMailerService = new NodeMailerService();
    this.__jwtService = new JwtService();
  }

  getUserUseCase(): IgetUser {
    return new GetUserUseCase(this._authRepository);
  }

  getTemporaryStoreUseCase(): IregisterUserTemporarily {
    return new RegisterUserTemporarily(this._rediseService, this._otpService);
  }
  getSendOtpEmailServiceUseCase(): IsendOtpEmailUseCase {
    return new SendOtpEmailUseCase(this._nodeMailerService);
  }
  getSendForgotPasswordEmailServiceUseCase(): IsendForgotPasswordEmailUseCase {
    return new SendForgotPasswordEmailUseCase(this._nodeMailerService);
  }
  getResendOtpUseCase(): IresendOtpUseCase {
    return new ResendOtpUseCase(this._rediseService, this._otpService);
  }
  verifyUserUseCase(): IotpVerification {
    return new OtpVerification(
      this._rediseService,
      this._authRepository,
      this.__jwtService
    );
  }
  signInUserUseCase(): IsignInUserUseCase {
    return new SignInUserUseCase(this._authRepository, this.__jwtService);
  }
  forgotPasswordUseCase():IforgotPassword{
    return new ForgotPasswordUseCase( this._authRepository  , this.__jwtService );
  }

  setNewPasswordUseCase(): IsetNewPasswordUseCase{
    return new SetNewPasswordUseCase(this._authRepository , this.__jwtService);
  }
}

export { DIContainer };
