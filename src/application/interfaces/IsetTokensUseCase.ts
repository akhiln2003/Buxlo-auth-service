import { Response } from "express";

export interface IsetTokensUseCase{
    execute( res: Response, accessToken: string, refreshToken: string):void;

}