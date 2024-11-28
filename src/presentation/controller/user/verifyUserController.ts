import { Request, Response } from "express"
import { IotpVerification } from "../../../application/interfaces/Iotp"

export class OtpVerifyController{
    private verifyUserUseCase: IotpVerification
    constructor(verifyUserUseCase: IotpVerification ){
        this.verifyUserUseCase = verifyUserUseCase
    }

    async verify( req: Request , res: Response ):Promise<Response>{
        return res.send("ddfddf")
    }


}