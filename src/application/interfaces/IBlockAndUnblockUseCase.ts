import { UserResponseDto } from "../../domain/zodSchemaDto/output/userResponse.dto";

export interface IBlockAndUnblockUseCase {
    execute( id: string , isBlocked: boolean  ): Promise<UserResponseDto>;
}
