import { UserResponseDto } from "../dto/userResponse.dto";

export interface IListUser {
    execute(role:string): Promise<UserResponseDto[]|[]>;
}
