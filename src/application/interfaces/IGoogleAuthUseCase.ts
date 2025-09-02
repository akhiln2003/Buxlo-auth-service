
export interface IGoogleAuthUseCase {
    execute( token: string , role: string ):Promise<any>;
}
