import { User } from "../../../domine/entities/User";
import { ITokenService } from "../../../domine/interfaces/ITokenService";
import { IUserRepository } from "../../../domine/interfaces/IUserRepository";
import { Password } from "../../services/PasswordHash";




export class SignInUser {
    constructor(
        private userRepository : IUserRepository,
        private jwtservice : ITokenService
    ){}
    async execute({
        email,
        password
    }:Pick< User , 'email' | 'password'>):Promise< User | any>{
        const user = await this.userRepository.findByEmail(email);
        if( user?.isBlocked ){
            throw new Error("User is blocked I wand to chage this erros to common ");
        }
        if(!user){
            return{ nottfount: true }
        }

        if( user && await Password.compare( password , user.password )){  
            const accessToken = this.jwtservice.generateAccessToken(user);
            const refreshToken = this.jwtservice.generateRefreshToken(user);
            return {
                user,
                accessToken,
                refreshToken
            }
        }
        return null
    }
}