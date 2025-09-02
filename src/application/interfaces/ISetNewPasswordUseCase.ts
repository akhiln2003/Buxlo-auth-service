export interface ISetNewPasswordUseCase{
    execute(password: string , token: string ): Promise<any>;
}