import { z } from "zod";


export const signUpDto = z.object({
  email: z.string({
    required_error: "email is required"
  }).email("Invalid email address"),
  password: z.string({
    required_error: "Password is required"
  }).trim().min(6, "Password must be at least 6 characters long"),
  name: z.string({
    required_error: "Name is required"
  }).min(1, "Minimum one character"),
});
