import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponseDto";

export interface IblockAndUnblockUseCase {
    execute( id: string , isBlocked: boolean  ): Promise<UserResponseDto>;
}
