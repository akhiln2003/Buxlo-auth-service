import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { IchangePasswordUseCase } from "../../interfaces/IchangePasswordUseCase";

export class ChangePasswordUseCase implements IchangePasswordUseCase {
  constructor(private _authRepository: IuserRepository) {}
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
