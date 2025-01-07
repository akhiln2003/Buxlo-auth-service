import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { IlistUser } from "../../interfaces/IlistUserUsecase";

export class ListUserUseCase implements IlistUser{
    constructor(private userRepositary: IuserRepository){}
   async execute(role: string): Promise<any> {
    return await this.userRepositary.findByRole(role);
   }
} 