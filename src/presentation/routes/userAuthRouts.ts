import { validateReq } from "@buxlo/common";
import { Router } from "express";
import { SignUpController } from "../controller/user/signUpController";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { otpSchemaDto, resendOtpSchemaDto } from "../../zodSchemaDto/user/otpDto";
import { OtpVerifyController } from "../controller/user/verifyUserController";
import { ResendOtpController } from "../controller/user/resendOtpController";
import { signUpDto } from "../../zodSchemaDto/user/signUpDto";
import { signInDto } from "../../zodSchemaDto/user/signInDto";
import { SignInController } from "../controller/user/signInController";
import { singOutController } from "../controller/user/singOutController";
import { forgotPasswordDto } from "../../zodSchemaDto/user/forgotPasswordDto";
import { ForgotPassword } from "../controller/user/forgotPasswordController";


const router = Router();
const diContainer = new DIContainer();


// Inject dependencies into the Controller

const signUpController = new SignUpController(
    diContainer.getUserUseCase(),
    diContainer.getTemporaryStoreUseCase(),
    diContainer.getSendOtpEmailServiceUseCase()
);


const otpVerifyController = new OtpVerifyController(
    diContainer.verifyUserUseCase()
);

const resendOtpController = new ResendOtpController(
    diContainer.getSendOtpEmailServiceUseCase(),
    diContainer.getResendOtpUseCase()
);

const signInController = new SignInController(
    diContainer.signInUserUseCase(),
);

const signOutController = new singOutController();

const forgotPasswordController  =  new ForgotPassword(
    diContainer.forgotPasswordUseCase(),
    diContainer.getSendForgotPasswordEmailServiceUseCase()
);


/////////////////////////////////////



router.post("/signup", validateReq(signUpDto) , signUpController.signUp);
router.post('/verifyotp', validateReq(otpSchemaDto), otpVerifyController.verify);
router.post('/resendotp', validateReq(resendOtpSchemaDto), resendOtpController.resend);
router.post('/signin', validateReq(signInDto), signInController.signIn);
router.post('/signout' , signOutController.singOut );
router.post('/forgotpassword' , validateReq(forgotPasswordDto) , forgotPasswordController.forgot );







export { router as userRoutes };
