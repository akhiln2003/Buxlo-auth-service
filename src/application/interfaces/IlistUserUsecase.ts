import { UserResponseDto } from "../../zodSchemaDto/output/userResponseDto";

export interface IlistUser {
    execute(role:string): Promise<UserResponseDto[]|[]>;
}
