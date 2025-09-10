import JWT, { SignOptions } from "jsonwebtoken";
import { User } from "../../domain/entities/User";
import {
  ITokenData,
  ITokenService,
} from "../../domain/interfaces/ITokenService";
import { OAuth2Client } from "google-auth-library";
import { Response } from "express";
import { BadRequest } from "@buxlo/common";

export class JwtService implements ITokenService {
  private readonly _accessTokenSecret: string;
  private readonly _refreshTokenSecret: string;
  private readonly _forgotPasswordSecret: string;
  private readonly _googleClientId: string;

  constructor() {
    this._accessTokenSecret = process.env.JWT_ACCESS_SECRET as string;
    this._refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string;
    this._forgotPasswordSecret = process.env
      .JWT_FORGOTPASSWORD_SECRET as string;
    this._googleClientId = process.env.GOOGLE_CLIENT_ID as string;
  }
  generateAccessToken(user: Pick<User, "id" | "email" | "role">): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const options: SignOptions = {
      expiresIn: "15m",
    };

    return JWT.sign(payload, this._accessTokenSecret, options);
  }

  generateRefreshToken(user: Pick<User, "id" | "email" | "role">): string {
    return JWT.sign(
      { id: user.id, email: user.email, role: user.role },
      this._refreshTokenSecret,
      { expiresIn: "7d" }
    );
  }

  generateResentPasswordToken(user: Pick<User, "email" | "id">): string {
    return JWT.sign(
      { id: user.id, email: user.email },
      this._forgotPasswordSecret,
      { expiresIn: "15m" }
    );
  }

  verifyToken(token: string, secret: string): ITokenData {
    const decoded = JWT.verify(token, secret);

    if (typeof decoded === "string") {
      throw new BadRequest("Invalid token payload: expected object but got string");
    }

    return decoded as ITokenData;
  }

  setTokens(res: Response, accessToken?: string, refreshToken?: string): void {
    const isProduction = process.env.NODE_ENV === "production";
    if (accessToken) {
      res.cookie("userAccessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict", // strict for added CSRF protection
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
    }
    if (refreshToken) {
      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict", // strict for added CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
  }

  async verifyGoogleToken(token: string) {
    const client = new OAuth2Client(this._googleClientId);

    // Verify the token
    const verify = await client.verifyIdToken({
      idToken: token,
      audience: this._googleClientId,
    });
    return verify.getPayload();
  }

  decode(toke: string) {
    return JWT.decode(toke);
  }
}
