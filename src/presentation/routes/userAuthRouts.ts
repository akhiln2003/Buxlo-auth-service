import { validateReq } from "@buxlo/common";
import { Router } from "express";
import { SignUpController } from "../controller/user/signUpController";
import { signUpSchema } from "../../zodSchemaDto/user/registorShemas";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { otpSchema } from "../../zodSchemaDto/user/verifyOtpDto";
import { OtpVerifyController } from "../controller/user/verifyUserController";


const router = Router();
const diContainer = new DIContainer();


// Inject dependencies into the Controller

const signUpController = new SignUpController(
    diContainer.getUserUseCase(),
    diContainer.getTemporaryStoreUseCase(),
    diContainer.getEmailServiceUseCase()
);


const otpVerifyController = new OtpVerifyController(
    diContainer.verifyUserUseCase()
)

/////////////////////////////////////

router.post("/signup", validateReq(signUpSchema), async (req, res) => await signUpController.signUp(req, res));
// router.post('/verifyOtp' , validateReq(otpSchema) , async(req,res)=> await otpVerifyController.verify(req,res))






export { router as userRoutes };
