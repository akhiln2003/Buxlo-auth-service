import { BadRequest } from "@buxlo/common";
import { Password } from "../../application/services/passwordHash";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { Auth } from "../database";

export class UserRepository implements IUserRepository {
  // creating and save new verified user
  async create(user: User): Promise<User> {
    const newUser = Auth.build(user);
    const newData = await newUser.save();
    return newData;
  }

  // find user by ther _id
  async findById(id: string): Promise<User | null> {
    const data = await Auth.findById(id);
    if (!data) return null;
    return data;
  }

  async findOne(query: object): Promise<User | null> {
    return await Auth.findOne(query);
  }

  async getUserDetails(userId: string): Promise<User | null> {
    try {
      const userDetails = await Auth.findById(userId);
      return userDetails ? userDetails : null;
    } catch (error: any) {
      throw new BadRequest(`Failed to get userDetails: ${error.message}`);
    }
  }

  // find user by ther emailId
  async findByEmail(email: string): Promise<User | null> {
    const data = await Auth.findOne({ email });
    if (!data) return null;
    return data;
  }

  async findByRole(role: string): Promise<User[] | []> {
    return await Auth.find({ role });
  }

  async find(
    role: string,
    page: number = 1,
    searchData?: string
  ): Promise<{ users: User[]; totalPages: number }> {
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
    const users = await Auth.find(filter).skip(skip).limit(limit);

    return { users, totalPages };
  }

  async update(_id: string, query: object): Promise<User> {
    const data = await Auth.findByIdAndUpdate(_id, {
      $set: query,
    });
    if (!data) throw new BadRequest("Faild to find user invalid userId ");
    return data;
  }
  async deleteUserProfileData(
    userId: string,
    data: { avatar?: string }
  ): Promise<User> {
    try {
      const updatedUser = await Auth.findByIdAndUpdate(userId, {
        $unset: data,
      });
      if (!updatedUser)
        throw new BadRequest("Faild to find user invalid userId ");
      return updatedUser;
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



