import { z } from "zod";

export const blockAndUnblockDto = z.object({
  id: z.string({ required_error: "id is required" }),
  isBlocked: z.boolean({ required_error: "isBlock is required" }),
});
