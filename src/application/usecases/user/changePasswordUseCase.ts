import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { IchangePasswordUseCase } from "../../interfaces/IchangePasswordUseCase";

export class ChangePasswordUseCase implements IchangePasswordUseCase {
  constructor(private authRepository: IuserRepository) {}
  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<any> {
    return await this.authRepository.changePassword(
      userId,
      currentPassword,
      newPassword
    );
  }
}
