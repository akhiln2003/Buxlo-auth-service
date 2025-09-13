import { UserResponseDto } from "../dto/userResponse.dto";

export interface IBlockAndUnblockUseCase {
    execute( id: string , isBlocked: boolean  ): Promise<UserResponseDto>;
}
