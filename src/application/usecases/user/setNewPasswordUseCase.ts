import { ITokenService } from "../../../domain/interfaces/ITokenService";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import {
  ISetNewPasswordUseCase,
  SetNewPasswordResult,
} from "../../interfaces/ISetNewPasswordUseCase";
import { Password } from "../../services/passwordHash";

export class SetNewPasswordUseCase implements ISetNewPasswordUseCase {
  constructor(
    private _userRepositary: IUserRepository,
    private _jwtservice: ITokenService
  ) {}
  async execute(
    password: string,
    token: string
  ): Promise<SetNewPasswordResult> {
    try {
      const { id } = ( this._jwtservice.verifyToken(
        token,
        process.env.JWT_FORGOTPASSWORD_SECRET as string
      )) as {
        id: string;
        email: string;
        iat: number;
        exp: number;
      };

      const hashPassword = (await Password.toHash(password)) as string;

      await this._userRepositary.update(id, { password: hashPassword });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
}
