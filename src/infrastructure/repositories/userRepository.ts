import { BadRequest } from "@buxlo/common";
import { Password } from "../../application/services/passwordHash";
import { User } from "../../domain/entities/User";
import { IuserRepository } from "../../domain/interfaces/IuserRepository";
import { Auth } from "../database";
import {
  UserMapper,
  UserResponseDto,
} from "../../zodSchemaDto/output/userResponseDto";

export class UserRepository implements IuserRepository {
  // creating and save new verified user
  async create(user: User): Promise<UserResponseDto> {
    const newUser = Auth.build(user);
    const newData = await newUser.save();
    return UserMapper.toDto(newData);
  }

  // find user by ther _id
  async findById(id: string): Promise<UserResponseDto | null> {
    const data = await Auth.findById(id);
    if (!data) return null;
    return UserMapper.toDto(data);
  }

  async findOne(query: object): Promise<User | null> {
    return await Auth.findOne(query);
  }

  // find user by ther emailId
  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const data = await Auth.findOne({ email });
    if (!data) return null;
    return UserMapper.toDto(data);
  }

  async findByRole(role: string): Promise<UserResponseDto[] | []> {
    const data = await Auth.find({ role });
    return data.map((user) => UserMapper.toDto(user));
  }

  async find(
    role: string,
    page: number = 1,
    searchData?: string
  ): Promise<{ users: UserResponseDto[]; totalPages: number }> {
    const limit = 10; // Number of users per page
    const skip = (page - 1) * limit;

    // Create search filter
    const filter: any = { role };
    if (searchData !== "undefined") {
      filter.$or = [
        { name: { $regex: `^${searchData}`, $options: "i" } },
        { email: { $regex: `^${searchData}`, $options: "i" } },
      ];
    }

    // Count total documents based on filter
    const totalCount = await Auth.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch users with pagination
    const data = await Auth.find(filter).skip(skip).limit(limit);
    const users = data.map((user) => UserMapper.toDto(user));

    return { users, totalPages };
  }

  async update(_id: string, query: object): Promise<UserResponseDto> {
    const data = await Auth.findByIdAndUpdate(_id, {
      $set: query,
    });

    return UserMapper.toDto(data);
  }
  async deleteUserProfileData(
    userId: string,
    data: { avatar?: string }
  ): Promise<UserResponseDto> {
    try {
      const updatedUser = await Auth.findByIdAndUpdate(userId, {
        $unset: data,
      });
      return UserMapper.toDto(updatedUser);
    } catch (error: any) {
      throw new Error(`db error to update user: ${error.message}`);
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await Auth.findById(userId);

    if (!user || !user.password) {
      throw new BadRequest("User not found or password missing");
    }

    if (await Password.compare(currentPassword, user.password)) {
      const newHashPassword = await Password.toHash(newPassword);
      await Auth.findByIdAndUpdate(userId, {
        $set: { password: newHashPassword },
      });
      return { message: "Password changed successfully" };
    } else {
      throw new BadRequest("Current password is incorrect");
    }
  }
}
