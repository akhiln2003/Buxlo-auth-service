export interface IsetNewPasswordUseCase{
    execute(password: string , token: string ): Promise<any>;
}