
export interface IgoogleAuthUseCase {
    execute( token: string , role: string ):Promise<any>;
}
