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
    return Auth.find({role});
  }

  async update(_id: string, query: object):Promise<User | null>  {
    return await Auth.findByIdAndUpdate(
      _id,
      {
        $set: query,
      }
    ).select('-password');
  }
}
