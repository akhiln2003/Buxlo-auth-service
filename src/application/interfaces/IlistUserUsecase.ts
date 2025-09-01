import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponseDto";

export interface IlistUser {
    execute(role:string): Promise<UserResponseDto[]|[]>;
}
