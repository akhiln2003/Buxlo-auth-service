import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IGetUser } from "../../interfaces/IGetUser";

export class GetUserUseCase implements IGetUser {
  constructor(private _userRepositary: IUserRepository) {}

  async execute({
    email,
    role,
  }: {
    email: string;
    role: string;
  }): Promise<User | null> {
    return await this._userRepositary.findOne({ email, role });
  }
}
