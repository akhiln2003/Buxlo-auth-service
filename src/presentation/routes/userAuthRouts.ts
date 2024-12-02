import { validateReq } from "@buxlo/common";
import { Router } from "express";
import { SignUpController } from "../controller/user/signUpController";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import {  otpSchemaDto, resendOtpSchemaDto } from "../../zodSchemaDto/user/otpDto";
import { OtpVerifyController } from "../controller/user/verifyUserController";
import { ResendOtpController } from "../controller/user/resendOtpController";
import { signUpSchemaDto } from "../../zodSchemaDto/user/registorShemas";


const router = Router();
const diContainer = new DIContainer();


// Inject dependencies into the Controller

const signUpController = new SignUpController(
    diContainer.getUserUseCase(),
    diContainer.getTemporaryStoreUseCase(),
    diContainer.getSendEmailServiceUseCase()
);


const otpVerifyController = new OtpVerifyController(
    diContainer.verifyUserUseCase()
)

const resendOtpController = new ResendOtpController(
    diContainer.getSendEmailServiceUseCase(),
    diContainer.getResendOtpUseCase()
)

/////////////////////////////////////

router.post("/signup", validateReq(signUpSchemaDto),signUpController.signUp);
router.post('/verifyotp' , validateReq(otpSchemaDto) , otpVerifyController.verify);
router.post('/resendotp' , validateReq(resendOtpSchemaDto) , resendOtpController.resend);






export { router as userRoutes };
