import { z } from "zod";

export const signInDto = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().trim().min(6, "Password must be at least 6 characters long"),
})