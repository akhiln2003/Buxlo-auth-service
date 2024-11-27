import { Request, Response } from "express";
import { DIContainer } from "../../../infrastructure/di/DIContainer";


export class SignUpController{
   private getUser = DIContainer.getUserUseCase();
   private temporaryStoreAndOtpUseCase = DIContainer.getTemporaryStorUseCase();
   private sendOtpEmailUseCase = DIContainer.getEmailServiceUseCase()

 async signUp( req:Request , res:Response){
   try {
      const { email , password , name , avatar } = req.body;
      const userExist = await this.getUser.execute({ email });
      if( userExist ){
         throw new Error("User is alredy exist");
      }
      const otp = await this.temporaryStoreAndOtpUseCase.execute({ name, email, password , avatar}) as string;
      console.log("Your OTP is: "  , otp );
      await this.sendOtpEmailUseCase.execute({ email , name , otp})
      res.status(200).json({ message: "OTP sent to email.", email });
   } catch (error) {
      
   }
    

 }
}