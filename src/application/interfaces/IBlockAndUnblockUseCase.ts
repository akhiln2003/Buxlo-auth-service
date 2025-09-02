import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponseDto";

export interface IBlockAndUnblockUseCase {
    execute( id: string , isBlocked: boolean  ): Promise<UserResponseDto>;
}
