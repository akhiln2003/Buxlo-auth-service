import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponseDto";

export interface IListUser {
    execute(role:string): Promise<UserResponseDto[]|[]>;
}
