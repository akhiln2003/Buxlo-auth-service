import JWT, { SignOptions } from "jsonwebtoken";
import { User } from "../../domain/entities/User";
import { ItokenService } from "../../domain/interfaces/ItokenService";
import { OAuth2Client } from "google-auth-library";
import { Response } from "express";

export class JwtService implements ItokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly forgotPasswordSecret: string;
  private readonly googleClientId: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET as string;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string;
    this.forgotPasswordSecret = process.env.JWT_FORGOTPASSWORD_SECRET as string;
    this.googleClientId = process.env.GOOGLE_CLIENT_ID as string;
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

    return JWT.sign(payload, this.accessTokenSecret, options);
  }

  generateRefreshToken(user: Pick<User, "id" | "email" | "role">): string {
    return JWT.sign(
      { id: user.id, email: user.email, role: user.role },
      this.refreshTokenSecret,
      { expiresIn: "7d" }
    );
  }

  generateResentPasswordToken(user: Pick<User, "email" | "id">): string {
    return JWT.sign(
      { id: user.id, email: user.email },
      this.forgotPasswordSecret,
      { expiresIn: "15m" }
    );
  }

  verifyToken(token: string, secret: string): unknown {
    return JWT.verify(token, secret);
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
    const client = new OAuth2Client(this.googleClientId);

    // Verify the token
    const verify = await client.verifyIdToken({
      idToken: token,
      audience: this.googleClientId,
    });
    return verify.getPayload();
  }

  decode(toke: string) {
    return JWT.decode(toke);
  }
}
