import { Router } from "express";
import { SignUpController } from "../controller/user/signUp.controller";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { OtpVerifyController } from "../controller/common/verifyUser.controller";
import { ResendOtpController } from "../controller/common/resendOtp.controller";
import { SignInController } from "../controller/user/signIn.controller";
import { singOutController } from "../controller/common/singOut.controller";
import { ForgotPasswordController } from "../controller/user/forgotPassword.controller";
import { SetNewPasswordController } from "../controller/common/setNewPassword.controller";
import { GoogleAuthController } from "../controller/user/googleAuth.controller";
import { RefresgTokenController } from "../controller/common/authToken.controller";
import { validateReqBody } from "@buxlo/common";
import { signUpDto } from "../dto/signUp.dto";
import { otpSchemaDto, resendOtpSchemaDto } from "../dto/otp.dto";
import { signInDto } from "../dto/signIn.dto";
import { forgotPasswordDto } from "../dto/forgotPassword.dto";
import { setNewPasswordDto } from "../dto/setNewPassword.dto";
import { googleAuthDto } from "../dto/googleAuth.dto";

export class UserRouter {
  private _router: Router;
  private _diContainer: DIContainer;

  // Controllers
  private _signUpController!: SignUpController;
  private _otpVerifyController!: OtpVerifyController;
  private _resendOtpController!: ResendOtpController;
  private _signInController!: SignInController;
  private _signOutController!: singOutController;
  private _forgotPasswordController!: ForgotPasswordController;
  private _setNewPasswordController!: SetNewPasswordController;
  private _googleAuthController!: GoogleAuthController;
  private _tokenController!: RefresgTokenController;

  constructor() {
    this._router = Router();
    this._diContainer = new DIContainer();
    this._initializeControllers();
    this._initializeRoutes();
  }

  private _initializeControllers(): void {
    this._signUpController = new SignUpController(
      this._diContainer.getUserUseCase(),
      this._diContainer.getTemporaryStoreUseCase(),
      this._diContainer.getSendOtpEmailServiceUseCase()
    );

    this._otpVerifyController = new OtpVerifyController(
      this._diContainer.verifyUserUseCase(),
      this._diContainer.setTokensUseCase()
    );

    this._resendOtpController = new ResendOtpController(
      this._diContainer.getSendOtpEmailServiceUseCase(),
      this._diContainer.getResendOtpUseCase()
    );

    this._signInController = new SignInController(
      this._diContainer.signInUserUseCase(),
      this._diContainer.setTokensUseCase()
    );

    this._signOutController = new singOutController();

    this._forgotPasswordController = new ForgotPasswordController(
      this._diContainer.forgotPasswordUseCase(),
      this._diContainer.getSendForgotPasswordEmailServiceUseCase()
    );

    this._setNewPasswordController = new SetNewPasswordController(
      this._diContainer.setNewPasswordUseCase()
    );

    this._googleAuthController = new GoogleAuthController(
      this._diContainer.googelAuthUseCase(),
      this._diContainer.setTokensUseCase()
    );

    this._tokenController = new RefresgTokenController(
      this._diContainer.authTokenUseCase(),
      this._diContainer.setTokensUseCase()
    );
  }

  private _initializeRoutes(): void {
    this._router.post(
      "/signup",
      validateReqBody(signUpDto),
      this._signUpController.signUp
    );
    this._router.post(
      "/verifyotp",
      validateReqBody(otpSchemaDto),
      this._otpVerifyController.verify
    );
    this._router.post(
      "/resendotp",
      validateReqBody(resendOtpSchemaDto),
      this._resendOtpController.resend
    );
    this._router.post(
      "/signin",
      validateReqBody(signInDto),
      this._signInController.signIn
    );
    this._router.post("/signout", this._signOutController.singOut);
    this._router.post(
      "/forgotpassword",
      validateReqBody(forgotPasswordDto),
      this._forgotPasswordController.forgot
    );
    this._router.post(
      "/setnewpassword",
      validateReqBody(setNewPasswordDto),
      this._setNewPasswordController.setPassword
    );
    this._router.post(
      "/googleauth",
      validateReqBody(googleAuthDto),
      this._googleAuthController.auth
    );
    this._router.post("/refreshtoken", this._tokenController.validate);
  }

  public getRouter(): Router {
    return this._router;
  }
}
