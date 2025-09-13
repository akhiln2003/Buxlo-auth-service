import { UserResponseDto } from "../dto/userResponse.dto";

export type GoogleAuthResult =
  | { type: "invalidToken" }
  | { type: "blocked" }
  | {
      type: "success";
      accessToken: string;
      refreshToken: string;
      user: UserResponseDto;
    }
  | { type: "error"; error: unknown };

export interface IGoogleAuthUseCase {
  execute(token: string, role: string): Promise<GoogleAuthResult>;
}
