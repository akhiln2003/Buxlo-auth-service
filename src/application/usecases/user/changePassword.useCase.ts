import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IChangePasswordUseCase } from "../../interfaces/IChangePasswordUseCase";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(private _authRepository: IUserRepository) {}
  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{message:string}> {
    return await this._authRepository.changePassword(
      userId,
      currentPassword,
      newPassword
    );
  }
}
