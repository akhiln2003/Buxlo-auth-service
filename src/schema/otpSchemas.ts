import { z } from "zod";

export const otpSchema = z.object({
    otp: z.number().positive().min(4).max(4)
});