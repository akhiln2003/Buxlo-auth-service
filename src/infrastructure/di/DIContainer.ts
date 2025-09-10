import {
  ISendForgotPasswordEmailUseCase,
  ISendOtpEmailUseCase,
} from "../../application/interfaces/IEmailService";
import { IGetUser } from "../../application/interfaces/IGetUser";
import {
  IOtpVerification,
  IresendOtpUseCase,
} from "../../application/interfaces/IOtp";
import { IRegisterUserTemporarily } from "../../application/interfaces/IRegisterUserTemporarily";
import { OTPService } from "../../application/services/OTPService";
import { OtpVerification } from "../../application/usecases/user/otpVerification.useCase";
import { RegisterUserTemporarily } from "../../application/usecases/common/registerUserTemporarily";
import { ResendOtpUseCase } from "../../application/usecases/user/resendOtp.useCase";
import { SendOtpEmailUseCase } from "../../application/usecases/user/sendOtpEmail.useCase";
import { JwtService } from "../external-services/JwtService";
import { NodeMailerService } from "../external-services/nodeMailerService";
import { RedisUserRepository } from "../repositories/cacheUserRepo";
import { UserRepository } from "../repositories/userRepository";
import { GetUserUseCase } from "../../application/usecases/user/getUser.useCase";
import { ISignInUserUseCase } from "../../application/interfaces/ISignInUserUseCase";
import { SignInUserUseCase } from "../../application/usecases/user/signInUser.useCase";
import { IForgotPassword } from "../../application/interfaces/IForgotPassword";
import { ForgotPasswordUseCase } from "../../application/usecases/user/forgotPassword.useCase";
import { SendForgotPasswordEmailUseCase } from "../../application/usecases/user/sendForgotPasswodEmail.useCase";
import { SetNewPasswordUseCase } from "../../application/usecases/user/setNewPassword.useCase";
import { ISetNewPasswordUseCase } from "../../application/interfaces/ISetNewPasswordUseCase";
import { IGoogleAuthUseCase } from "../../application/interfaces/IGoogleAuthUseCase";
import { GoogleAuthUseCase } from "../../application/usecases/user/googleAuth.useCase";
import { IListUser } from "../../application/interfaces/IListUserUsecase";
import { ListUserUseCase } from "../../application/usecases/user/lilstUser.useCase";
import { FetchUsersUseCase } from "../../application/usecases/user/fetchUsers.useCase";
import { BlockAndUnblockUseCase } from "../../application/usecases/user/blockAndUnblock.useCase";
import { SetTokensUseCase } from "../../application/usecases/user/setTokens.useCase";
import { ISetTokensUseCase } from "../../application/interfaces/ISetTokensUseCase";
import { IAuthTokenUseCase } from "../../application/interfaces/IAuthTokenUseCase";
import { AuthTokenUseCase } from "../../application/usecases/user/authToken.useCase";
import { messageBroker } from "../MessageBroker/config";
import { UserCreatedProducer } from "../MessageBroker/kafka/producer/userCreatedProducer";
import { IS3Service } from "../@types/IS3Service";
import { S3Service } from "../external-services/s3-client";
import { ChangePasswordUseCase } from "../../application/usecases/user/changePassword.useCase";
import { IChangePasswordUseCase } from "../../application/interfaces/IChangePasswordUseCase";

class DIContainer {
  private _authRepository: UserRepository;
  private _rediseService: RedisUserRepository;
  private _otpService: OTPService;
  private _nodeMailerService: NodeMailerService;
  private __jwtService: JwtService;
  private _userCreatedProducer: UserCreatedProducer;
  private _s3Service: IS3Service;

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

  getUserUseCase(): IGetUser {
    return new GetUserUseCase(this._authRepository);
  }
  fetchUsersUseCase() {
    return new FetchUsersUseCase(this._authRepository);
  }

  getTemporaryStoreUseCase(): IRegisterUserTemporarily {
    return new RegisterUserTemporarily(this._rediseService, this._otpService);
  }
  getSendOtpEmailServiceUseCase(): ISendOtpEmailUseCase {
    return new SendOtpEmailUseCase(this._nodeMailerService);
  }
  getSendForgotPasswordEmailServiceUseCase(): ISendForgotPasswordEmailUseCase {
    return new SendForgotPasswordEmailUseCase(this._nodeMailerService);
  }
  getResendOtpUseCase(): IresendOtpUseCase {
    return new ResendOtpUseCase(this._rediseService, this._otpService);
  }
  verifyUserUseCase(): IOtpVerification {
    return new OtpVerification(
      this._rediseService,
      this._authRepository,
      this.__jwtService,
      this._userCreatedProducer
    );
  }
  setTokensUseCase(): ISetTokensUseCase {
    return new SetTokensUseCase(this.__jwtService);
  }
  authTokenUseCase(): IAuthTokenUseCase {
    return new AuthTokenUseCase(this.__jwtService);
  }
  signInUserUseCase(): ISignInUserUseCase {
    return new SignInUserUseCase(this._authRepository, this.__jwtService);
  }
  forgotPasswordUseCase(): IForgotPassword {
    return new ForgotPasswordUseCase(this._authRepository, this.__jwtService);
  }

  setNewPasswordUseCase(): ISetNewPasswordUseCase {
    return new SetNewPasswordUseCase(this._authRepository, this.__jwtService);
  }

  googelAuthUseCase(): IGoogleAuthUseCase {
    return new GoogleAuthUseCase(
      this.__jwtService,
      this._authRepository,
      this._userCreatedProducer,
      this._s3Service
    );
  }

  changePasswordUseCase(): IChangePasswordUseCase {
    return new ChangePasswordUseCase(this._authRepository);
  }
  listUserUseCase(): IListUser {
    return new ListUserUseCase(this._authRepository);
  }

  blockAndUnBlockUseCase() {
    return new BlockAndUnblockUseCase(this._authRepository);
  }
}

export { DIContainer };
