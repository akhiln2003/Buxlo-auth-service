import { ItokenService } from "../../../domin/interfaces/ItokenService";
import { IauthTokenUseCase } from "../../interfaces/IauthTokenUseCase";

export class AuthTokenUseCase implements IauthTokenUseCase {
  constructor(private jwtService: ItokenService) {}
  async execute(refreshToken: string): Promise<any> {
    try {
      const response:any = await this.jwtService.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      );
      const user = {
        id: response.id,
        email: response.email,
        role: response.role,
      };
      const accessToken = this.jwtService.generateAccessToken(user);
      return {
        accessToken,
      };

      console.log(response);
    } catch (error) {
      console.error(error);
      return { notAuth: true };
    }
  }
}
