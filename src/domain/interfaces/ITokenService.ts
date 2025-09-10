import { Response } from "express";
import { USER_ROLE } from "../../shared/enums/role";

export interface ITokenData {
  id: string;
  email: string;
  role: USER_ROLE;
  iat: number;
  exp: number;
}

export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  generateResentPasswordToken(payload: object): string;
  verifyToken(token: string, secret: string): ITokenData;
  setTokens(res: Response, accessToken?: string, refreshToken?: string): void;
  verifyGoogleToken(toke: string): any;
  decode(toke: string): any;
}
