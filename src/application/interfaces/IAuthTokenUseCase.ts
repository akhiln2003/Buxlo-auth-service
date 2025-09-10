export interface IAuthTokenUseCase {
  execute(
    refreshToken: string
  ): Promise<{ accessToken?: string; notAuth?: boolean }>;
}
