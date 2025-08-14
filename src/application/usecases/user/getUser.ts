import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { IgetUser } from "../../interfaces/IgetUser";

export class GetUserUseCase implements IgetUser {
  constructor(private _userRepositary: IuserRepository) {}

  async execute({email , role}: { email: string; role: string; }): Promise<any> {
    return await this._userRepositary.findOne({email , role});

  }
}
