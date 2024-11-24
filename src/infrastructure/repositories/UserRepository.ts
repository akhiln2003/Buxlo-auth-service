import { User } from "../../domine/entities/User";
import { IUserRepository } from "../../domine/interfaces/IUserRepository";
import { Auth } from "../database";

export class UserRepository implements IUserRepository{
    async create(user: User): Promise<any> {
        const newUser = Auth.build(user);
        return await newUser.save();
    }
    
    async findById(id: string): Promise<User | null> {
        return await Auth.findById(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        return Auth.findOne({email})
    }

    async update(user: User): Promise<void> {
        await Auth.findByIdAndUpdate( user.id , user);
    }

}