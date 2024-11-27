import { validateReq } from "@buxlo/common";
import { Router } from "express";
import { SignUpController } from "../controller/user/signUpController";
import { signUpSchema } from "../../schema/userSchemas";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { otpSchema } from "../../schema/otpSchemas";


const router = Router();
const container = new DIContainer();


// Inject dependencies into the SignUpController
const signUpController = new SignUpController(
    container.getUserUseCase(),
    container.getTemporaryStoreUseCase(),
    container.getEmailServiceUseCase()
);

// const 

router.post("/signup", validateReq(signUpSchema), async (req, res) => await signUpController.signUp(req, res));
router.post('/verifyOtp' , validateReq(otpSchema) , async(req,res)=> {})






export { router as userRoutes };
