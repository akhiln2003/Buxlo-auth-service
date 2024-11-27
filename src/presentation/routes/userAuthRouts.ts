import { validateSchema } from "@buxlo/common";
import { Router } from "express";
import { SignUpController } from "../controller/user/signUpController";
import { signUpSchema } from "../../schema/userSchemas";


const router = Router();
const signUpController = new SignUpController();

router.post("/signup",validateSchema(signUpSchema), async (req, res) => await signUpController.signUp(req, res) );
export { router as userRoutes };
