import { z } from "zod";

export const otpSchema = z.object({
    otp: z.number().positive().min(4).max(4 , "OTP bust be 4 numbers")
});