export interface IForgotPassword {
    execute( email: string , role: string ): Promise<any>;
}