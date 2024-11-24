export interface ITokenService {
    generateAccessToken(payload: object): string;
    generateRefreshToken(payload: object): string;
    verifyRefreshToken(token: string): any;
}