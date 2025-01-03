export interface IauthTokenUseCase{
        execute( refreshToken: string ): Promise<any>;

}