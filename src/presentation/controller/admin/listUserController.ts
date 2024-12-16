import { Request, Response } from "express";
import { IlistUser } from "../../../application/interfaces/IlistUserUsecase";
import { USER_ROLE } from "../../../shared/enums/role";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class ListUserController {
    constructor(private listUserUseCase: IlistUser){}

    listUser = async(req: Request , res: Response)=>{
        try {
            const data = this.listUserUseCase.execute(USER_ROLE.USER);
            res.send(HttpStatusCode.OK).json({data}); 
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.InternalServerError).json({error:"Somthing when wrong please try again laiter"});
        }
        
    };
}