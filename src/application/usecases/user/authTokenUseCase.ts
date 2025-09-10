import {
  ITokenData,
  ITokenService,
} from "../../../domain/interfaces/ITokenService";
import { IAuthTokenUseCase } from "../../interfaces/IAuthTokenUseCase";

export class AuthTokenUseCase implements IAuthTokenUseCase {
  constructor(private _jwtService: ITokenService) {}
  async execute(
    refreshToken: string
  ): Promise<{ accessToken?: string; notAuth?: boolean }> {
    try {
      const response: ITokenData = this._jwtService.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      );
      const user = {
        id: response.id,
        email: response.email,
        role: response.role,
      };
      const accessToken = this._jwtService.generateAccessToken(user);
      return {
        accessToken,
      };
    } catch (error) {
      console.error(error);
      return { notAuth: true };
    }
  }
}
