export interface SetNewPasswordResult {
  ok?: boolean;
  error?: unknown;
}

export interface ISetNewPasswordUseCase {
  execute(password: string, token: string): Promise<SetNewPasswordResult>;
}
