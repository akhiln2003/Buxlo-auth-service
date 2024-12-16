import { User } from "../../../domin/entities/User";
import { ItokenService } from "../../../domin/interfaces/ItokenService";
import { IuserRepository } from "../../../domin/interfaces/IuserRepository";
import { IgoogleAuthUseCase } from "../../interfaces/IgoogleAuthUseCase";
import { IotpVerificationResponse } from "../../interfaces/Iotp";
import { Password } from "../../services/passwordHash";

export class GoogelAuthUseCase implements IgoogleAuthUseCase {
  constructor(
    private jwtService: ItokenService,
    private userRepository: IuserRepository
  ) {}

  async execute(
    token: string,
    role: string
  ): Promise<IotpVerificationResponse> {
    try {
      const validat = await this.jwtService.verifyGoogleToken(token);

      if (!validat) {
        return {
          success: false,
          message: "Sonthing when wrong",
        };
      }

      const hashPassword = (await Password.toHash(validat.sub)) as string;

      const existUser = await this.userRepository.findByEmail(validat.email);
      
      if (existUser && existUser.role == role) {
        
        const accessToken = this.jwtService.generateAccessToken(existUser);
        const refreshToken = this.jwtService.generateRefreshToken(existUser);
        return { success: true, accessToken, refreshToken, user: existUser };
      } else {
        
        // Creating new User
        const user = new User(
          validat.given_name,
          validat.email,
          hashPassword,
          role,
          false,
          validat.picture
        );
        const newUser = await this.userRepository.create(user);
        const accessToken = this.jwtService.generateAccessToken(user);
        const refreshToken = this.jwtService.generateRefreshToken(user);
        return { success: true, accessToken, refreshToken, user: newUser };
      }
    } catch (error) {
      console.error("Error from OTP varification : ", error);
      return { success: false, message: "Internal server error" };
    }
  }
}
