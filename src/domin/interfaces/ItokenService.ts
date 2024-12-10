export interface ItokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  generateResentPasswordToken(payload:object):string;
  verifyRefreshToken(token: string , secret:string): unknown;
}
