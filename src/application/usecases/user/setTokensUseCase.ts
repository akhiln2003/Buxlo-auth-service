import { Response } from "express";
import { ITokenService } from "../../../domain/interfaces/ITokenService";
import { ISetTokensUseCase } from "../../interfaces/ISetTokensUseCase";

export class SetTokensUseCase implements ISetTokensUseCase {
  constructor(private _jwtService: ITokenService) {}
  execute(res: Response, accessToken?: string, refreshToken?: string): void {
    this._jwtService.setTokens(res, accessToken, refreshToken);
  }
}
