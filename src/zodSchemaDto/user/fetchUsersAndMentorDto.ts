import { z } from "zod";

export const fetchUsersAndMentorDto = z.object( {
  page:z.string({
    required_error:"Page number is required"
  }),
  searchData:z.string({
    required_error:"searchData must be string"
  }).optional()
});
