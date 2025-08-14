import { BlockError, NotAuthorizedError, NotFountError } from "@buxlo/common";
import { ItokenService } from "../../../domain/interfaces/ItokenService";
import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import {
  UserMapper,
  UserResponseDto,
} from "../../../zodSchemaDto/output/userResponseDto";
import { IsignInUserUseCase } from "../../interfaces/IsignInUserUseCase";
import { Password } from "../../services/passwordHash";

export class SignInUserUseCase implements IsignInUserUseCase {
  constructor(
    private _userRepository: IuserRepository,
    private _jwtService: ItokenService
  ) {}
  async execute(
    email: string,
    password: string,
    role: string,
    isAdmin: boolean
  ): Promise<{
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this._userRepository.findOne({ email, role });

    if (!user || user.isAdmin !== isAdmin) {
      throw new NotFountError("This email is invalid");
    }
    if (user?.isBlocked) {
      throw new BlockError();
    }

    if (await Password.compare(password, user.password)) {
      const accessToken = this._jwtService.generateAccessToken(user);
      const refreshToken = this._jwtService.generateRefreshToken(user);

      return {
        user: UserMapper.toDto(user),
        accessToken,
        refreshToken,
      };
    }
    throw new NotAuthorizedError(
      "Invalid credentials. Please check your password and try again."
    );
  }
}
