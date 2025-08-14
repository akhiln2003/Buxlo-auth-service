import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { UserResponseDto } from "../../../zodSchemaDto/output/userResponseDto";
import { IfetchUserUseCase } from "../../interfaces/IfetchUserUseCase";

export class FetchUsersUseCase implements IfetchUserUseCase {
  constructor(private _userRepositary: IuserRepository) {}
  async execute(
    role: string,
    page: number,
    searchData: string | undefined
  ): Promise<{ users: UserResponseDto[]; totalPages: number } > {
    return await this._userRepositary.find(role, page, searchData);
  }
}
