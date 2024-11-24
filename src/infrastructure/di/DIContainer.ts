import { SignInUser } from "@/application/usecases/user/SignInUser";
import { UserRepository } from "../repositories/UserRepository";
import { JwtService } from "../external-services/JwtService";

class DIContainer{
    private static _authRepository = new UserRepository();
    private static _jwtService = new JwtService();
    static getSignInUserUseCase(){
        return new SignInUser(this._authRepository , this._jwtService )
    }
}




export { DIContainer }