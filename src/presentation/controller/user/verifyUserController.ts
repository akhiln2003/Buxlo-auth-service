import { Request, Response } from "express"
import { IotpVerification } from "../../../application/interfaces/Iotp"

export class OtpVerifyController {
    private verifyUserUseCase: IotpVerification
    constructor(verifyUserUseCase: IotpVerification) {
        this.verifyUserUseCase = verifyUserUseCase
    }

    async verify(req: Request, res: Response): Promise<void> {
        try {
            const { otp, email } = req.body;
            const response = await this.verifyUserUseCase.execute({ otp, email });
            if (response.success) {

                res.cookie('userAccessToken', response.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });
                res.cookie('userRefreshToken', response.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                 res.status(200).json({ userVerified: response.user });
            }
            else{
                 res.status(400).json({ message: response.message });
            }
        } catch (err) {
            console.error("Error in OTP verification controller:", err);
             res.status(500).json({ message: "Internal server error" });
        }
    }


}