import { Router } from "express";
import { SignUpController } from "../controller/user/signUpController";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import {
  otpSchemaDto,
  resendOtpSchemaDto,
} from "../../zodSchemaDto/user/otpDto";
import { OtpVerifyController } from "../controller/common/verifyUserController";
import { ResendOtpController } from "../controller/common/resendOtpController";
import { signUpDto } from "../../zodSchemaDto/user/signUpDto";
import { signInDto } from "../../zodSchemaDto/user/signInDto";
import { SignInController } from "../controller/user/signInController";
import { singOutController } from "../controller/common/singOutController";
import { forgotPasswordDto } from "../../zodSchemaDto/user/forgotPasswordDto";
import { ForgotPasswordController } from "../controller/user/forgotPasswordController";
import { setNewPasswordDto } from "../../zodSchemaDto/user/setNewPasswordDto";
import { SetNewPasswordController } from "../controller/common/setNewPasswordController";
import { googleAuthDto } from "../../zodSchemaDto/user/googleAuthDto";
import { GoogleAuthController } from "../controller/user/googleAuthController";
import { RefresgTokenController } from "../controller/common/authTokenController";
import { validateReqBody } from "@buxlo/common";

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
