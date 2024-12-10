import { z } from "zod";

export const setNewPasswordDto = z.object({
    password: z.string({
        required_error: "Password is required"
      }).trim().min(6, "Password must be at least 6 characters long"),
    token: z.string({
        required_error: "Tokent expired"
    }).min(1, "Name is required")
});