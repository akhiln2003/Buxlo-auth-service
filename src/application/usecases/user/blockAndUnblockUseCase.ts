import { User } from "../../../domain/entities/User";
import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { IblockAndUnblockUseCase } from "../../interfaces/IblockAndUnblockUseCase";

export class BlockAndUnblockUseCase implements IblockAndUnblockUseCase {
  constructor(private _userRepositary: IuserRepository) {}

  async execute(id: string, isBlocked: boolean): Promise<User | any> {
    return await this._userRepositary.update(id, { isBlocked });
  }
}
