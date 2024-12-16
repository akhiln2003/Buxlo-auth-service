import { IuserRepository } from "../../../domin/interfaces/IuserRepository";
import { IfetchUserUseCase } from "../../interfaces/IfetchUserUseCase";

export class FetchUsersUseCase implements IfetchUserUseCase {
  constructor(private userRepositary: IuserRepository) {}
  async execute(role: string): Promise<any> {
    return await this.userRepositary.findByRole(role);
  }
}
