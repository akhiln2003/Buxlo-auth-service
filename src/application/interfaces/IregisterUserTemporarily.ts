import { User } from "../../domin/entities/User";



export interface IregisterUserTemporarily{
    execute( user: Pick<User, 'avatar' | 'email' | 'name' | 'password'> ): Promise<string | void>
}