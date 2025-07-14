import { z } from "zod";

export const signUpDto = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
      "Password must contain at least one letter, one number, and one special character"
    ),

  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Minimum one character"),
});
