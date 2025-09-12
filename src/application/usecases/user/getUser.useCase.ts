import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import {
  UserMapper,
  UserResponseDto,
} from "../../../domain/zodSchemaDto/output/userResponse.dto";
import { IGetUser } from "../../interfaces/IGetUser";

export class GetUserUseCase implements IGetUser {
  constructor(private _userRepositary: IUserRepository) {}

  async execute({
    email,
    role,
  }: {
    email: string;
    role: string;
  }): Promise<UserResponseDto | null> {
    const user = await this._userRepositary.findOne({ email, role });
    return user ? UserMapper.toDto(user) : null;
  }
}
