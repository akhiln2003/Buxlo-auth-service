export interface IforgotPassword {
    execute( email: string ): Promise<any>;
}