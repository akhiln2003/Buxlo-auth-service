import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import {
  UserMapper,
  UserResponseDto,
} from "../../../domain/zodSchemaDto/output/userResponseDto";
import { IfetchUserUseCase } from "../../interfaces/IfetchUserUseCase";

export class FetchUsersUseCase implements IfetchUserUseCase {
  constructor(private _userRepositary: IuserRepository) {}
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
