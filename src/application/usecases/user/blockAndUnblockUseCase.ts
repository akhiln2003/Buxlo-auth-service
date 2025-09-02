import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import {
  UserMapper,
  UserResponseDto,
} from "../../../domain/zodSchemaDto/output/userResponseDto";
import { IBlockAndUnblockUseCase } from "../../interfaces/IBlockAndUnblockUseCase";

export class BlockAndUnblockUseCase implements IBlockAndUnblockUseCase {
  constructor(private _userRepositary: IUserRepository) {}

  async execute(id: string, isBlocked: boolean): Promise<UserResponseDto> {
    const data = await this._userRepositary.update(id, { isBlocked });
    return UserMapper.toDto(data);
  }
}
