import JWT from "jsonwebtoken";
import { User } from "../../domin/entities/User";
import { ItokenService } from "../../domin/interfaces/ItokenService";

export class JwtService implements ItokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly forgotPasswordSecret: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET as string;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string;
    this.forgotPasswordSecret = process.env.JWT_FORGOTPASSWORD_SECRET as string;
  }
  generateAccessToken(user: Pick<User, "id" | "email" | "role">): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const options = {
      expiresIn: "1m",
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

  generateResentPasswordToken(user: Pick<User, "email" | "id">): string{
    return JWT.sign(
      {id: user.id , email: user.email},
      this.forgotPasswordSecret,
      {expiresIn:'1m'}
    );
  }

  verifyRefreshToken(token: string , secret: string): unknown {
    return JWT.verify(token, secret);
  }
}
