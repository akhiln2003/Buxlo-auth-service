import { User } from "../../domin/entities/User";

export interface IsignInUserUseCase{
    execute(email: string , password: string ): Promise<User | any>;

}