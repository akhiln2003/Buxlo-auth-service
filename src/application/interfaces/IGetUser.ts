import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponse.dto";

export interface IGetUser {
  execute(params: {
    email: string;
    role: string;
  }): Promise<UserResponseDto | null>;
}
