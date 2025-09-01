import { User } from "../entities/User";

export interface IuserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(_id: string, query: object): Promise<User>;
  findByRole(role: string): Promise<User[] | []>;
  findOne(query: object): Promise<User | null>;
  find(
    role: string,
    page: number,
    searchData: string | undefined
  ): Promise<{ users: User[]; totalPages: number }>;
  getUserDetails(userId: string): Promise<User | null>;
  deleteUserProfileData(
    userId: string,
    data: { avatar?: string }
  ): Promise<User>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }>;
}
