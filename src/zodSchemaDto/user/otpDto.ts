import { z } from "zod";

export const otpSchemaDto = z.object({
    otp: z.string().length(4 , "Enter valid otp"),
    email: z.string().email("Invalid email address")
});


export const resendOtpSchemaDto = z.object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(1, "Name is required")
})