export interface IforgotPassword {
    execute( email: string , role: string ): Promise<any>;
}