import { DIContainer } from "@/infrastructure/di/DIContainer";
import { NextFunction, Request, Response } from "express";

export class signInController {
    private signInUser = DIContainer.getSignInUserUseCase();

    async signIn( req: Request , res: Response , next: NextFunction ){
        // const dto = Object.assign( new SignInUserDtot() , req.body ) // I am stoped higher becose of first i wand ot create server 
    }
}