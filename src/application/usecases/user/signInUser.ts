import { User } from "../../../domain/entities/User";
import { ItokenService } from "../../../domain/interfaces/ItokenService";
import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { IsignInUserUseCase } from "../../interfaces/IsignInUserUseCase";
import { Password } from "../../services/passwordHash";

export class SignInUserUseCase implements IsignInUserUseCase {
  constructor(
    private _userRepository: IuserRepository,
    private _jwtService: ItokenService
  ) {}
  async execute(
    email: string,
    password: string,
    role: string,
    isAdmin: boolean
  ): Promise<User | any> {
    const user = await this._userRepository.findOne({email , role });
    
    if (!user || user.isAdmin !== isAdmin ) {
      return {
        notfount: true,
      };
    }
    if (user?.isBlocked) {
      return {
        isBlocked: true,
      };
    }
    
    if (await Password.compare(password, user.password)) {      
      const accessToken =  this._jwtService.generateAccessToken(user);
      const refreshToken = this._jwtService.generateRefreshToken(user);

      return {
        user,
        accessToken,
        refreshToken,
      };
    }
    return {
      passwordNotMatch: true
    };
  }
}
