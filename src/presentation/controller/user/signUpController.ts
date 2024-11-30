import { Request, Response } from "express";
import { IgetUser } from "../../../application/interfaces/IgetUser";
import { IregisterUserTemporarily } from "../../../application/interfaces/IregisterUserTemporarily";
import { IsendOtpEmailUseCase } from "../../../application/interfaces/IemailService";

export class SignUpController {
    private getUserUseCase: IgetUser;
    private temporaryStoreAndOtpUseCase: IregisterUserTemporarily;
    private sendOtpEmailUseCase: IsendOtpEmailUseCase;

    constructor(getUserUseCase: IgetUser, temporaryStoreAndOtpUseCase: IregisterUserTemporarily, sendOtpEmailUseCase: IsendOtpEmailUseCase) {
        this.getUserUseCase = getUserUseCase;
        this.temporaryStoreAndOtpUseCase = temporaryStoreAndOtpUseCase;
        this.sendOtpEmailUseCase = sendOtpEmailUseCase;
    }

    async signUp(req: Request, res: Response) {
        try {
            const { email, password, name, avatar } = req.body;
            
            // Check if user exists
            const userExist = await this.getUserUseCase.execute({ email });
            if (userExist) {
                res.status(409).json({ error: "User already exists" });
                return
            }
            
            // Store user temporarily and generate OTP
            const otp = await this.temporaryStoreAndOtpUseCase.execute({ name, email, password, avatar }) as string;
            
            // Send OTP via email
            await this.sendOtpEmailUseCase.execute({ email, name, otp });
            console.log("Your OTP is: "  , otp );
            
            
            res.status(200).json({ message: "OTP sent to email.", email });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred during sign-up"});
        }
    }
}
