import { z } from "zod";

export const googleAuthDto = z.object({

  token: z.string({
      required_error: "Token is required"
    }),
  });