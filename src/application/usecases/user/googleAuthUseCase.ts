import { User } from "../../../domain/entities/User";
import { ITokenService } from "../../../domain/interfaces/ITokenService";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IS3Service } from "../../../infrastructure/@types/IS3Service";
import { UserCreatedProducer } from "../../../infrastructure/MessageBroker/kafka/producer/userCreatedProducer";
import { USER_ROLE } from "../../../shared/enums/role";
import {
  GoogleAuthResult,
  IGoogleAuthUseCase,
} from "../../interfaces/IGoogleAuthUseCase";
import { Password } from "../../services/passwordHash";
import axios from "axios";
import sharp from "sharp";
import { UserMapper } from "../../../domain/zodSchemaDto/output/userResponseDto";

interface GooglePayload {
  sub: string;
  email: string;
  given_name: string;
  picture?: string;
}

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    private _jwtService: ITokenService,
    private _userRepository: IUserRepository,
    private _userCreatedProducer: UserCreatedProducer,
    private _s3Service: IS3Service
  ) {}

  async execute(token: string, role: string): Promise<GoogleAuthResult> {
    try {
      const payload = (await this._jwtService.verifyGoogleToken(
        token
      )) as GooglePayload | null;

      if (!payload) {
        return { type: "invalidToken" };
      }

      const hashPassword = await Password.toHash(payload.sub);

      const existUser = await this._userRepository.findByEmail(payload.email);
      if (existUser?.isBlocked) return { type: "blocked" };

      let randomImageName: string | undefined;
      if (payload.picture) {
        try {
          const response = await axios.get<ArrayBuffer>(payload.picture, {
            responseType: "arraybuffer",
          });
          const buffer = await sharp(Buffer.from(response.data))
            .resize({ height: 300, width: 300, fit: "cover" })
            .toBuffer();

          randomImageName = `${Math.random()}${Date.now()}`;
          const uploadResponse = await this._s3Service.uploadImageToBucket(
            buffer,
            "image/jpeg",
            role === USER_ROLE.USER
              ? `UserProfiles/${randomImageName}`
              : `MentorProfiles/${randomImageName}`
          );

          if (uploadResponse.$metadata.httpStatusCode !== 200) {
            console.error("Failed to upload profile image to S3");
            randomImageName = undefined;
          }
        } catch (error) {
          console.error("Error downloading or uploading profile image", error);
        }
      }

      if (existUser && existUser.role === role) {
        const accessToken = this._jwtService.generateAccessToken(existUser);
        const refreshToken = this._jwtService.generateRefreshToken(existUser);
        return {
          type: "success",
          accessToken,
          refreshToken,
          user: UserMapper.toDto(existUser),
        };
      } else {
        // Create new user
        const user = new User(
          payload.given_name,
          payload.email,
          hashPassword as string,
          role as USER_ROLE,
          false,
          randomImageName
        );
        const newUser = await this._userRepository.create(user);

        const accessToken = this._jwtService.generateAccessToken(newUser);
        const refreshToken = this._jwtService.generateRefreshToken(newUser);

        await this._userCreatedProducer.produce({
          id: newUser.id as string,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          isAdmin: newUser.isAdmin,
          isBlocked: newUser.isBlocked,
          isGoogle: newUser.isGoogle,
          role: newUser.role as "user" | "admin" | "mentor",
        });

        return {
          type: "success",
          accessToken,
          refreshToken,
          user: UserMapper.toDto(newUser),
        };
      }
    } catch (error) {
      console.error("Error from GoogleAuthUseCase:", error);
      return { type: "error", error };
    }
  }
}
