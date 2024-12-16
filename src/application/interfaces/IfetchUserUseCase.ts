export interface IfetchUserUseCase {
    execute( role: string ): Promise<any>;
}
