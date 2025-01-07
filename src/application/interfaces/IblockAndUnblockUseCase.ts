import { User } from "../../domain/entities/User";

export interface IblockAndUnblockUseCase {
    execute( id: string , isBlocked: boolean  ): Promise<User | any>;
}
