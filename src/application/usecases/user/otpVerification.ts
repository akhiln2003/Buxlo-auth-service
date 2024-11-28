import { User } from "../../../domin/entities/User";
import { IredisRepository } from "../../../domin/interfaces/IcacheUserRepo";
import { ItokenService } from "../../../domin/interfaces/ItokenService";
import { IuserRepository } from "../../../domin/interfaces/IuserRepository";
import { IotpVerification, IotpVerificationParams, IotpVerificationResponse } from "../../interfaces/Iotp";



export class OtpVerification implements IotpVerification {
    constructor(
        private redisRepository: IredisRepository,
        private userRepository: IuserRepository,
        private jwtservice: ItokenService
    ){}

    async execute({ otp, email}:IotpVerificationParams): Promise<IotpVerificationResponse>{
        try {
            const storedOTP = await this.redisRepository.getOtp(email);
            if(!storedOTP) return { success: false , message:"OTP not found or has expired"};

            if( otp !== storedOTP ) return { success: false, message: "Invalid OTP provided" };

            const unverifiedUser = await this.redisRepository.getUnverifiedUser(email) ;
            if (!unverifiedUser)  return { success: false, message: "No unverified user found" };

            const user = new User(
                unverifiedUser.name,
                unverifiedUser.email,
                unverifiedUser.password,
                unverifiedUser.avatar 
            )

            const newUser = await this.userRepository.create(user);
            await this.redisRepository.removeUnverifiedUser(email);
            const accessToken = this.jwtservice.generateAccessToken(user);
            const refreshToken = this.jwtservice.generateRefreshToken(user);
            return { success: true , accessToken,refreshToken , user:newUser}
        } catch (err) {
            console.error('Error from email varification : ' , err);
            return { success: false , message:"Internal server error"}
            
        }
    }   
}