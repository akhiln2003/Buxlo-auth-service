import { z } from "zod";

export const otpSchema = z.object({
    otp: z.string().trim().length(4 , "Enter valid otp")
});