import { User } from "../entities/User";

export interface IredisRepository {
  saveUnverifiedUser(
    email: string,
    user: Pick<User, "avatar" | "email" | "name" | "password">
  ): Promise<void>;
  getUnverifiedUser(email: string): Promise<User | null>;
  removeUnverifiedUser(email: string): Promise<void>;
  storeOtp(email: string, otp: string): Promise<void>;
  getOtp(email: string): Promise<string | null>;
  storeToken(token: string, email: string): Promise<void>;
  verifyToken(email: string): Promise<boolean>;
  deleteToken(email: string): Promise<void>;
}
