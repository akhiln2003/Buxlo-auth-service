import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { UserMapper, UserResponseDto } from "../../../domain/zodSchemaDto/output/userResponseDto";
import { IlistUser } from "../../interfaces/IlistUserUsecase";

export class ListUserUseCase implements IlistUser {
  constructor(private _userRepositary: IuserRepository) {}
  async execute(role: string): Promise<UserResponseDto[] | []> {
    const data = await this._userRepositary.findByRole(role);
    return data.map((user) => UserMapper.toDto(user));
  }
}
