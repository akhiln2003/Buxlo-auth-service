import { UserResponseDto } from "../../zodSchemaDto/output/userResponseDto";
import { User } from "../entities/User";

export interface IuserRepository {
  create(user: User): Promise<UserResponseDto>;
  findByEmail(email: string): Promise<UserResponseDto | null>;
  findById(id: string): Promise<UserResponseDto | null>;
  update(_id: string, query: object): Promise<UserResponseDto>;
  findByRole(role: string): Promise<UserResponseDto[] | []>;
  findOne(query: object): Promise<User | null>;
  find(
    role: string,
    page: number,
    searchData: string | undefined
  ): Promise<{ users: UserResponseDto[]; totalPages: number }>;
  deleteUserProfileData(
    userId: string,
    data: { avatar?: string }
  ): Promise<UserResponseDto>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }>;
}
