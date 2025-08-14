import { User } from "../../domain/entities/User";

export interface IgetUser {
  execute(params: {
    email: string;
    role: string;
  }): Promise<User | null>;
}
