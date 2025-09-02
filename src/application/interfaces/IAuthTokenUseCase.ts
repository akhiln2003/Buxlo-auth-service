export interface IAuthTokenUseCase{
        execute( refreshToken: string ): Promise<any>;

}