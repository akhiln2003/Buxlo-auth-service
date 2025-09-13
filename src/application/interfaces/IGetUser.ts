import { UserResponseDto } from "../dto/userResponse.dto";

export interface IGetUser {
  execute(params: {
    email: string;
    role: string;
  }): Promise<UserResponseDto | null>;
}
