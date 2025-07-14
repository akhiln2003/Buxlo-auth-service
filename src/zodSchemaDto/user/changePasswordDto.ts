import { z } from "zod";

const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
    "Password must contain at least one letter, one number, and one special character"
  );

export const changePasswordDto = z.object({
  userId: z
    .string({
      required_error: "userId is required",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID format"),

  currentPassword: z
    .string({
      required_error: "current password is required",
    })
    .trim()
    .min(6, "Password must be at least 6 characters long"),
  newPassword: passwordValidation
});
