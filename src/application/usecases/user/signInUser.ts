import { BlockError } from "@buxlo/common";
import { User } from "../../../domin/entities/User";
import { ItokenService } from "../../../domin/interfaces/ItokenService";
import { IuserRepository } from "../../../domin/interfaces/IuserRepository";
import { IsignInUserUseCase } from "../../interfaces/IsignInUserUseCase";
import { Password } from "../../services/passwordHash";

export class SignInUserUseCase implements IsignInUserUseCase {
  constructor(
    private userRepository: IuserRepository,
    private jwtService: ItokenService
  ) {}
  async execute(
    email: string,
    password: string,
    role: string,
    isAdmin: boolean
  ): Promise<User | any> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user || user.role !== role || user.isAdmin !== isAdmin ) {
      return {
        notfount: true,
      };
    }
    if (user?.isBlocked) {
      throw new BlockError();
    }
    
    if (await Password.compare(password, user.password)) {      
      const accessToken =  this.jwtService.generateAccessToken(user);
      const refreshToken = this.jwtService.generateRefreshToken(user);

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
