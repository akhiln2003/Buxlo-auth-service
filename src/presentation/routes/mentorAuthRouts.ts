import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { validateReq } from "@buxlo/common";
import { signUpDto } from "../../zodSchemaDto/user/signUpDto";
import { SignUpController } from "../controller/Mentor/signUpController";
import { otpSchemaDto, resendOtpSchemaDto } from "../../zodSchemaDto/user/otpDto";
import { OtpVerifyController } from "../controller/common/verifyUserController";
import { ResendOtpController } from "../controller/common/resendOtpController";
import { SignInController } from "../controller/Mentor/signInController";
import { signInDto } from "../../zodSchemaDto/user/signInDto";
import { singOutController } from "../controller/common/singOutController";
import { forgotPasswordDto } from "../../zodSchemaDto/user/forgotPasswordDto";
import { ForgotPasswordController } from "../controller/Mentor/forgotPasswordController";
import { setNewPasswordDto } from "../../zodSchemaDto/user/setNewPasswordDto";
import { SetNewPasswordController } from "../controller/common/setNewPasswordController";



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

const forgotPasswordController  =  new ForgotPasswordController(
    diContainer.forgotPasswordUseCase(),
    diContainer.getSendForgotPasswordEmailServiceUseCase()
);

const setNewPasswordController = new SetNewPasswordController(
    diContainer.setNewPasswordUseCase()
);


//////////////////////////////////////////

router.use((req,res,next)=>{
    console.log(req.url , req.method);
    next();
    
});

router.post('/signup' , validateReq(signUpDto) , signUpController.signUp );
router.post('/verifyotp', validateReq(otpSchemaDto), otpVerifyController.verify);
router.post('/resendotp', validateReq(resendOtpSchemaDto), resendOtpController.resend);
router.post('/signin', validateReq(signInDto), signInController.signIn);
router.post('/signout' , signOutController.singOut );
router.post('/forgotpassword' , validateReq(forgotPasswordDto) , forgotPasswordController.forgot );
router.post('/setnewpassword' , validateReq(setNewPasswordDto) , setNewPasswordController.setPassword);





















export { router as mentorRoutes };