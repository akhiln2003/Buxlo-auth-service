
export interface IChangePasswordUseCase {
  execute(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{message:string}>;
}
