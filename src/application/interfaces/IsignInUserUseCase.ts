import { User } from "../../domain/entities/User";

export interface IsignInUserUseCase{
    execute(email: string , password: string , role: string , isAdmin: boolean ): Promise<User | any>;

}