import { Router } from "express";
import { SignUpController } from "../controller/user/signUpController";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { otpSchemaDto, resendOtpSchemaDto } from "../../zodSchemaDto/user/otpDto";
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



const router = Router();
const diContainer = new DIContainer();


// Inject dependencies into the Controller

const signUpController = new SignUpController(
    diContainer.getUserUseCase(),
    diContainer.getTemporaryStoreUseCase(),
    diContainer.getSendOtpEmailServiceUseCase()
);


const otpVerifyController = new OtpVerifyController(
    diContainer.verifyUserUseCase(),
    diContainer.setTokensUseCase()
);

const resendOtpController = new ResendOtpController(
    diContainer.getSendOtpEmailServiceUseCase(),
    diContainer.getResendOtpUseCase()
);

const signInController = new SignInController(
    diContainer.signInUserUseCase(),
    diContainer.setTokensUseCase()
);

const signOutController = new singOutController();

const forgotPasswordController  =  new ForgotPasswordController(
    diContainer.forgotPasswordUseCase(),
    diContainer.getSendForgotPasswordEmailServiceUseCase()
);


const setNewPasswordController = new SetNewPasswordController(
    diContainer.setNewPasswordUseCase()
);


const googleAuthController = new GoogleAuthController(
    diContainer.googelAuthUseCase(),
    diContainer.setTokensUseCase()

);

const tokenController = new RefresgTokenController(
    diContainer.authTokenUseCase(),
    diContainer.setTokensUseCase()
);

/////////////////////////////////////


router.post("/signup", validateReqBody(signUpDto) , signUpController.signUp);
router.post('/verifyotp', validateReqBody(otpSchemaDto), otpVerifyController.verify);
router.post('/resendotp', validateReqBody(resendOtpSchemaDto), resendOtpController.resend);
router.post('/signin', validateReqBody(signInDto), signInController.signIn);
router.post('/signout' , signOutController.singOut );
router.post('/forgotpassword' , validateReqBody(forgotPasswordDto) , forgotPasswordController.forgot );
router.post('/setnewpassword' , validateReqBody(setNewPasswordDto) , setNewPasswordController.setPassword);
router.post('/googleauth', validateReqBody(googleAuthDto) , googleAuthController.auth);
router.post('/refreshtoken' , tokenController.validate);




export { router as userRoutes };
