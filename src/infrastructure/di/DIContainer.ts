import {
  IsendForgotPasswordEmailUseCase,
  IsendOtpEmailUseCase,
} from "../../application/interfaces/IemailService";
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
import { IgoogleAuthUseCase } from "../../application/interfaces/IgoogleAuthUseCase";
import { GoogelAuthUseCase } from "../../application/usecases/user/googleAuthUseCase";
import { IlistUser } from "../../application/interfaces/IlistUserUsecase";
import { ListUserUseCase } from "../../application/usecases/user/lilstUserUseCase";
import { FetchUsersUseCase } from "../../application/usecases/user/fetchUsersUseCase";
import { BlockAndUnblockUseCase } from "../../application/usecases/user/blockAndUnblockUseCase";
import { SetTokensUseCase } from "../../application/usecases/user/setTokensUseCase";
import { IsetTokensUseCase } from "../../application/interfaces/IsetTokensUseCase";
import { IauthTokenUseCase } from "../../application/interfaces/IauthTokenUseCase";
import { AuthTokenUseCase } from "../../application/usecases/user/authTokenUseCase";
import { messageBroker } from "../MessageBroker/config";
import { UserCreatedProducer } from "../MessageBroker/kafka/producer/userCreatedProducer";
import { Is3Service } from "../@types/Is3Service";
import { S3Service } from "../external-services/s3-client";
import { ChangePasswordUseCase } from "../../application/usecases/user/changePasswordUseCase";
import { IchangePasswordUseCase } from "../../application/interfaces/IchangePasswordUseCase";

class DIContainer {
  private _authRepository: UserRepository;
  private _rediseService: RedisUserRepository;
  private _otpService: OTPService;
  private _nodeMailerService: NodeMailerService;
  private __jwtService: JwtService;
  private _userCreatedProducer: UserCreatedProducer;
  private _s3Service: Is3Service;

  constructor() {
    this._authRepository = new UserRepository();
    this._rediseService = new RedisUserRepository();
    this._otpService = new OTPService();
    this._nodeMailerService = new NodeMailerService();
    this.__jwtService = new JwtService();
    this._userCreatedProducer = new UserCreatedProducer(
      messageBroker.getKafkaClient().producer
    );
    this._s3Service = new S3Service();
  }

  getUserUseCase(): IgetUser {
    return new GetUserUseCase(this._authRepository);
  }
  fetchUsersUseCase() {
    return new FetchUsersUseCase(this._authRepository);
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
      this.__jwtService,
      this._userCreatedProducer
    );
  }
  setTokensUseCase(): IsetTokensUseCase {
    return new SetTokensUseCase(this.__jwtService);
  }
  authTokenUseCase(): IauthTokenUseCase {
    return new AuthTokenUseCase(this.__jwtService);
  }
  signInUserUseCase(): IsignInUserUseCase {
    return new SignInUserUseCase(this._authRepository, this.__jwtService);
  }
  forgotPasswordUseCase(): IforgotPassword {
    return new ForgotPasswordUseCase(this._authRepository, this.__jwtService);
  }

  setNewPasswordUseCase(): IsetNewPasswordUseCase {
    return new SetNewPasswordUseCase(this._authRepository, this.__jwtService);
  }

  googelAuthUseCase(): IgoogleAuthUseCase {
    return new GoogelAuthUseCase(
      this.__jwtService,
      this._authRepository,
      this._userCreatedProducer,
      this._s3Service
    );
  }

  changePasswordUseCase():IchangePasswordUseCase{
    return new ChangePasswordUseCase(this._authRepository,);
  }
  listUserUseCase(): IlistUser {
    return new ListUserUseCase(this._authRepository);
  }

  blockAndUnBlockUseCase() {
    return new BlockAndUnblockUseCase(this._authRepository);
  }
}

export { DIContainer };
