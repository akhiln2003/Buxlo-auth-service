import { User } from "../../domain/entities/User";

export interface IGetUser {
  execute(params: {
    email: string;
    role: string;
  }): Promise<User | null>;
}
