import { Response } from "express";

export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  generateResentPasswordToken(payload:object):string;
  verifyToken(token: string , secret:string): unknown;
  setTokens(res: Response, accessToken?: string, refreshToken?: string): void;
  verifyGoogleToken(toke: string): any;
  decode(toke:string):any
}
