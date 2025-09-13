import { UserResponseDto } from "../dto/userResponse.dto";

export interface IFetchUserUseCase {
  execute(
    role: string,
    page: number,
    searchData: string | undefined
  ): Promise<{ users: UserResponseDto[]; totalPages: number  }>;
}
