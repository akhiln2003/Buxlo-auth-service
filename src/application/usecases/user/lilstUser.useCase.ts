import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserMapper, UserResponseDto } from "../../../domain/zodSchemaDto/output/userResponse.dto";
import { IListUser } from "../../interfaces/IListUserUsecase";

export class ListUserUseCase implements IListUser {
  constructor(private _userRepositary: IUserRepository) {}
  async execute(role: string): Promise<UserResponseDto[] | []> {
    const data = await this._userRepositary.findByRole(role);
    return data.map((user) => UserMapper.toDto(user));
  }
}
