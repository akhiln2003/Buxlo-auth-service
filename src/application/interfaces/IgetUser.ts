export interface IgetUser {
    execute(params: { email: string }): Promise<any>;
}
