export interface IgetUser {
    execute(params: { email: string , role: string }): Promise<any>;
}
