import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserMapper, UserResponseDto } from "../../dto/userResponse.dto";

import { IFetchUserUseCase } from "../../interfaces/IFetchUserUseCase";

export class FetchUsersUseCase implements IFetchUserUseCase {
  constructor(private _userRepositary: IUserRepository) {}
  async execute(
    role: string,
    page: number,
    searchData: string | undefined
  ): Promise<{ users: UserResponseDto[]; totalPages: number }> {
    const data = await this._userRepositary.find(role, page, searchData);
    const users = data.users.map((user) => UserMapper.toDto(user));
    return { users, totalPages: data.totalPages };
  }
}
