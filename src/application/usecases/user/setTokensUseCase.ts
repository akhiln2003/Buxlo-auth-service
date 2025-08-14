import { Response } from "express";
import { ItokenService } from "../../../domain/interfaces/ItokenService";
import { IsetTokensUseCase } from "../../interfaces/IsetTokensUseCase";

export class SetTokensUseCase implements IsetTokensUseCase {
  constructor(private _jwtService: ItokenService) {}
  execute(res: Response, accessToken?: string, refreshToken?: string): void {
      this._jwtService.setTokens(res,accessToken,refreshToken);
  }
}
