import { NextFunction, Request, Response } from "express";
import { IsetNewPasswordUseCase } from "../../../application/interfaces/IsetNewPasswordUseCase";
import { NotFountError } from "@buxlo/common";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class SetNewPasswordController {
    constructor(
    private setNewPasswordUseCase: IsetNewPasswordUseCase
     
    ){}
    setPassword = async(req:Request,res:Response,next:NextFunction)=>{
       try {
        const { password , token } = req.body;
        const response = await this.setNewPasswordUseCase.execute(password , token);
        if( response?.notfount ){
            throw new NotFountError("ssdf");
        }
        if(response.ok){
            res.status(HttpStatusCode.OK).json({message:"Password reset successfully!"});
        }
        if(response.error){
            res.status(HttpStatusCode.InternalServerError).json({error: "Somthing wrong please try again laiter"});
        }
       } catch (error) {
        console.error("error from setNewPasswordController",error);
        next(error);
       }
        
    };
}