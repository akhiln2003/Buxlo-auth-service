import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { IlistUser } from "../../interfaces/IlistUserUsecase";

export class ListUserUseCase implements IlistUser{
    constructor(private _userRepositary: IuserRepository){}
   async execute(role: string): Promise<any> {
    return await this._userRepositary.findByRole(role);
   }
} 