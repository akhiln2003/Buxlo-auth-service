import { z } from "zod";

export const signInDto = z.object({
    email: z.string({
        required_error: "Email is required"
    }).email("Invalid email address"),
    password: z.string({
        required_error: "password is required"
    }).trim().min(6, "Password must be at least 6 characters long"),
})