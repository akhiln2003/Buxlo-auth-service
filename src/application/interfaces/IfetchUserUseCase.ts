import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponseDto";

export interface IfetchUserUseCase {
  execute(
    role: string,
    page: number,
    searchData: string | undefined
  ): Promise<{ users: UserResponseDto[]; totalPages: number  }>;
}
