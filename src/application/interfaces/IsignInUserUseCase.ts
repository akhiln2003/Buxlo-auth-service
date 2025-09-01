import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponseDto";

export interface IsignInUserUseCase {
  execute(
    email: string,
    password: string,
    role: string,
    isAdmin: boolean
  ): Promise<
     { user: UserResponseDto; accessToken: string; refreshToken: string }
   
  >;
}
