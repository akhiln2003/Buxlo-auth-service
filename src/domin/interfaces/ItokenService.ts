export interface ItokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  generateResentPasswordToken(payload:object):string;
  verifyToken(token: string , secret:string): unknown;
  verifyGoogleToken(toke: string): any;
  decode(toke:string):any
  
}
