import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponse.dto";

export interface IListUser {
    execute(role:string): Promise<UserResponseDto[]|[]>;
}
