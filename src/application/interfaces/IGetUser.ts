import { User } from "../../domain/entities/User.entity";

export interface IGetUser {
  execute(params: {
    email: string;
    role: string;
  }): Promise<User | null>;
}
