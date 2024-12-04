import { z } from "zod";

export const otpSchemaDto = z.object({
    otp: z.string({
        required_error: "Otp is required"
    }).length(4, "Enter valid otp"),
    email: z.string({
        required_error: "Email is required"
    }).email("Invalid email address")
});


export const resendOtpSchemaDto = z.object({
    email: z.string({
        required_error: "Email is required"
    }).email("Invalid email address"),
    name: z.string({
        required_error: "Name is required"
    }).min(1, "Name is required")
})