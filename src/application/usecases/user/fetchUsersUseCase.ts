import { User } from "../../../domain/entities/User";
import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { IfetchUserUseCase } from "../../interfaces/IfetchUserUseCase";

export class FetchUsersUseCase implements IfetchUserUseCase {
  constructor(private userRepositary: IuserRepository) {}
  async execute(
    role: string,
    page: number,
    searchData: string | undefined
  ): Promise<{ users: User[]; totalPages: number } | null> {
    return await this.userRepositary.find(role, page, searchData);
  }
}
