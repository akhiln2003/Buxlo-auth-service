import { z } from "zod";

export const otpSchemaDto = z.object({
    otp: z.string().trim().length(4 , "Enter valid otp")
});


export const resendOtpSchemaDto = z.object({
    email: z.string().email("Invalid email address")
})