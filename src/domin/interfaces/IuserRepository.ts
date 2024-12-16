import { User } from "../entities/User";

export interface IuserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(_id: string , query:object): Promise<User | null> ;
  findByRole(role: string) : Promise< User[]| null>
}
