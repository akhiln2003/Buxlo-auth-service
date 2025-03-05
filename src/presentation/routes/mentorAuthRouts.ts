import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { signUpDto } from "../../zodSchemaDto/user/signUpDto";
import { SignUpController } from "../controller/Mentor/signUpController";
import {
  otpSchemaDto,
  resendOtpSchemaDto,
} from "../../zodSchemaDto/user/otpDto";
import { OtpVerifyController } from "../controller/common/verifyUserController";
import { ResendOtpController } from "../controller/common/resendOtpController";
import { SignInController } from "../controller/Mentor/signInController";
import { signInDto } from "../../zodSchemaDto/user/signInDto";
import { singOutController } from "../controller/common/singOutController";
import { forgotPasswordDto } from "../../zodSchemaDto/user/forgotPasswordDto";
import { ForgotPasswordController } from "../controller/Mentor/forgotPasswordController";
import { setNewPasswordDto } from "../../zodSchemaDto/user/setNewPasswordDto";
import { SetNewPasswordController } from "../controller/common/setNewPasswordController";
import { googleAuthDto } from "../../zodSchemaDto/user/googleAuthDto";
import { GoogleAuthController } from "../controller/Mentor/googleAuthController";
import { validateReqBody } from "@buxlo/common";

export class MentorRouter {
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
  }

  public getRouter(): Router {
    return this.router;
  }
}
