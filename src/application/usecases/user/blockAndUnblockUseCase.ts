import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { UserResponseDto } from "../../../zodSchemaDto/output/userResponseDto";
import { IblockAndUnblockUseCase } from "../../interfaces/IblockAndUnblockUseCase";

export class BlockAndUnblockUseCase implements IblockAndUnblockUseCase {
  constructor(private _userRepositary: IuserRepository) {}

  async execute(id: string, isBlocked: boolean): Promise<UserResponseDto> {
    return await this._userRepositary.update(id, { isBlocked });
  }
}
