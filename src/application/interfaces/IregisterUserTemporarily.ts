import { User } from "../../domain/entities/User";



export interface IregisterUserTemporarily{
    execute( user: Pick<User, 'avatar' | 'email' | 'name' | 'password' | 'role' > ): Promise<string | void>
}