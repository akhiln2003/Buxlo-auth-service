import { z } from "zod";

export const forgotPasswordDto = z.object( {
  email: z
    .string({
      required_error: "email is required",
    })
    .email("Invalid email address"),
});
