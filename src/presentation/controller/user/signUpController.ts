// src/controller/user/SignUpController.ts
import { Request, Response } from "express";

export class SignUpController {
    private getUserUseCase: any;
    private temporaryStoreAndOtpUseCase: any;
    private sendOtpEmailUseCase: any;

    constructor(getUserUseCase: any, temporaryStoreAndOtpUseCase: any, sendOtpEmailUseCase: any) {
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
                 res.status(400).json({ error: "User already exists" });
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
            res.status(500).json({ error: "An error occurred during sign-up" });
        }
    }
}