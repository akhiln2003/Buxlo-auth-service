import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import {
  UserMapper,
  UserResponseDto,
} from "../../../domain/zodSchemaDto/output/userResponseDto";
import { IblockAndUnblockUseCase } from "../../interfaces/IblockAndUnblockUseCase";

export class BlockAndUnblockUseCase implements IblockAndUnblockUseCase {
  constructor(private _userRepositary: IuserRepository) {}

  async execute(id: string, isBlocked: boolean): Promise<UserResponseDto> {
    const data = await this._userRepositary.update(id, { isBlocked });
    return UserMapper.toDto(data);
  }
}
