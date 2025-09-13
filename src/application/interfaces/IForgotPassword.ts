import { UserResponseDto } from "../dto/userResponse.dto";

export type ForgotPasswordResult =
  | { type: "notFound" }
  | { type: "success"; resetPasswordUrl: string; user: UserResponseDto }
  | { type: "error"; error: unknown };

export interface IForgotPassword {
  execute(email: string, role: string): Promise<ForgotPasswordResult>;
}
