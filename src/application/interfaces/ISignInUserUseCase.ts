import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponse.dto";

export interface ISignInUserUseCase {
  execute(
    email: string,
    password: string,
    role: string,
    isAdmin: boolean
  ): Promise<
     { user: UserResponseDto; accessToken: string; refreshToken: string }
   
  >;
}
