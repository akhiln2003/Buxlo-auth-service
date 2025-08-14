import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { UserResponseDto } from "../../../zodSchemaDto/output/userResponseDto";
import { IlistUser } from "../../interfaces/IlistUserUsecase";

export class ListUserUseCase implements IlistUser{
    constructor(private _userRepositary: IuserRepository){}
   async execute(role: string): Promise<UserResponseDto[]|[]> {
    return await this._userRepositary.findByRole(role);
   }
} 