
export interface IchangePasswordUseCase {
  execute(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{message:string}>;
}
