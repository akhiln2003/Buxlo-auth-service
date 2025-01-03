import { Response } from "express";
import { ItokenService } from "../../../domin/interfaces/ItokenService";
import { IsetTokensUseCase } from "../../interfaces/IsetTokensUseCase";

export class SetTokensUseCase implements IsetTokensUseCase {
  constructor(private jwtService: ItokenService) {}
  execute(res: Response, accessToken?: string, refreshToken?: string): void {
      this.jwtService.setTokens(res,accessToken,refreshToken);
  }
}
