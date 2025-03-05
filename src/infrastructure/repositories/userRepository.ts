import { User } from "../../domain/entities/User";
import { IuserRepository } from "../../domain/interfaces/IuserRepository";
import { Auth } from "../database";

export class UserRepository implements IuserRepository {
  // creating and save new verified user
  async create(user: User): Promise<any> {
    const newUser = Auth.build(user);
    return await newUser.save();
  }

  // find user by ther _id
  async findById(id: string): Promise<User | null> {
    return await Auth.findById(id);
  }

  async findOne(query: object): Promise<User | null> {
    return await Auth.findOne(query);
  }

  // find user by ther emailId
  async findByEmail(email: string): Promise<User | null> {
    return Auth.findOne({ email });
  }

  async findByRole(role: string): Promise<User[] | null> {
    return Auth.find({ role });
  }

  async find(
    role: string,
    page: number = 1,
    searchData?: string
  ): Promise<{ users: User[]; totalPages: number } | null> {
    const limit = 10; // Number of users per page
    const skip = (page - 1) * limit;

    // Create search filter
    const filter: any = { role };
    if (searchData !== "undefined") {
      filter.$or = [
        { name: { $regex: searchData, $options: "i" } },
        { email: { $regex: searchData, $options: "i" } },
      ];
    }

    // Count total documents based on filter
    const totalCount = await Auth.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch users with pagination
    const users = await Auth.find(filter).skip(skip).limit(limit);

    return { users, totalPages };
  }

  async update(_id: string, query: object): Promise<User | null> {
    return await Auth.findByIdAndUpdate(_id, {
      $set: query,
    }).select("-password");
  }
  async deleteUserProfileData(
    userId: string,
    data: { avatar?: string }
  ): Promise<User | null> {
    try {
      const updatedUser = await Auth.findByIdAndUpdate(userId, {
        $unset: data,
      });
      return updatedUser;
    } catch (error: any) {
      throw new Error(`db error to update user: ${error.message}`);
    }
  }
}
