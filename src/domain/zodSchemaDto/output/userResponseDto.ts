import { z } from "zod";
import { User } from "../../entities/User";

export const userResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  isAdmin: z.boolean(),
  isBlocked: z.boolean(),
  isGoogle: z.boolean(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  avatar: z.string().optional(),
  premiumId: z.string().optional(),
});

export type UserResponseDto = z.infer<typeof userResponseDto>;

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    return userResponseDto.parse({
      id:  user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      isGoogle: user.isGoogle,
      role: user.role,
      premiumId: user.premiumId ?? undefined,
      createdAt: new Date(user.createdAt as Date),
      updatedAt: new Date(user.updatedAt as Date),
    });
  }
}
