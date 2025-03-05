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
  private router: Router;
  private diContainer: DIContainer;

  // Controllers
  private signUpController!: SignUpController;
  private otpVerifyController!: OtpVerifyController;
  private resendOtpController!: ResendOtpController;
  private signInController!: SignInController;
  private signOutController!: singOutController;
  private forgotPasswordController!: ForgotPasswordController;
  private setNewPasswordController!: SetNewPasswordController;
  private googleAuthController!: GoogleAuthController;
  private tokenController!: RefresgTokenController;

  constructor() {
    this.router = Router();
    this.diContainer = new DIContainer();
    this.initializeControllers();
    this.initializeRoutes();
  }

  private initializeControllers(): void {
    this.signUpController = new SignUpController(
      this.diContainer.getUserUseCase(),
      this.diContainer.getTemporaryStoreUseCase(),
      this.diContainer.getSendOtpEmailServiceUseCase()
    );

    this.otpVerifyController = new OtpVerifyController(
      this.diContainer.verifyUserUseCase(),
      this.diContainer.setTokensUseCase()
    );

    this.resendOtpController = new ResendOtpController(
      this.diContainer.getSendOtpEmailServiceUseCase(),
      this.diContainer.getResendOtpUseCase()
    );

    this.signInController = new SignInController(
      this.diContainer.signInUserUseCase(),
      this.diContainer.setTokensUseCase()
    );

    this.signOutController = new singOutController();

    this.forgotPasswordController = new ForgotPasswordController(
      this.diContainer.forgotPasswordUseCase(),
      this.diContainer.getSendForgotPasswordEmailServiceUseCase()
    );

    this.setNewPasswordController = new SetNewPasswordController(
      this.diContainer.setNewPasswordUseCase()
    );

    this.googleAuthController = new GoogleAuthController(
      this.diContainer.googelAuthUseCase(),
      this.diContainer.setTokensUseCase()
    );

    this.tokenController = new RefresgTokenController(
      this.diContainer.authTokenUseCase(),
      this.diContainer.setTokensUseCase()
    );
  }

  private initializeRoutes(): void {
    this.router.post(
      "/signup",
      validateReqBody(signUpDto),
      this.signUpController.signUp
    );
    this.router.post(
      "/verifyotp",
      validateReqBody(otpSchemaDto),
      this.otpVerifyController.verify
    );
    this.router.post(
      "/resendotp",
      validateReqBody(resendOtpSchemaDto),
      this.resendOtpController.resend
    );
    this.router.post(
      "/signin",
      validateReqBody(signInDto),
      this.signInController.signIn
    );
    this.router.post("/signout", this.signOutController.singOut);
    this.router.post(
      "/forgotpassword",
      validateReqBody(forgotPasswordDto),
      this.forgotPasswordController.forgot
    );
    this.router.post(
      "/setnewpassword",
      validateReqBody(setNewPasswordDto),
      this.setNewPasswordController.setPassword
    );
    this.router.post(
      "/googleauth",
      validateReqBody(googleAuthDto),
      this.googleAuthController.auth
    );
    this.router.post("/refreshtoken", this.tokenController.validate);
  }

  public getRouter(): Router {
    return this.router;
  }
}
