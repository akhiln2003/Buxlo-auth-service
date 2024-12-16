import { ItokenService } from "../../../domin/interfaces/ItokenService";
import { IuserRepository } from "../../../domin/interfaces/IuserRepository";
import { IsetNewPasswordUseCase } from "../../interfaces/IsetNewPasswordUseCase";
import { Password } from "../../services/passwordHash";

export class SetNewPasswordUseCase implements IsetNewPasswordUseCase {
  constructor(
    private userRepositary: IuserRepository,
    private jwtservice: ItokenService
  ) {}
  async execute(password: string, token: string): Promise<any> {
    try {
      const { id } = (await this.jwtservice.verifyToken(
        token,
        process.env.JWT_FORGOTPASSWORD_SECRET as string
      )) as {
        id: string;
        email: string;
        iat: number;
        exp: number;
      };

      const hashPassword = (await Password.toHash(password)) as string;

      await this.userRepositary.update(id, { password: hashPassword });

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
