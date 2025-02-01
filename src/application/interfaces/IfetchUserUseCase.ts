import { User } from "../../domain/entities/User";

export interface IfetchUserUseCase {
    execute( role: string  , page:number , searchData:string | undefined):Promise<{ users: User[]; totalPages: number } | null> 
}
