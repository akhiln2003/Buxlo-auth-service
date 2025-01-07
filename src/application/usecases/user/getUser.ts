import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { IgetUser } from "../../interfaces/IgetUser";

export class GetUserUseCase implements IgetUser {
  constructor(private userRepositary: IuserRepository) {}

  async execute({email , role}: { email: string; role: string; }): Promise<any> {
    return await this.userRepositary.findOne({email , role});

  }
}
