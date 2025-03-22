import { User } from "../../../domain/entities/User";
import { ItokenService } from "../../../domain/interfaces/ItokenService";
import { IuserRepository } from "../../../domain/interfaces/IuserRepository";
import { Is3Service } from "../../../infrastructure/@types/Is3Service";
import { UserCreatedProducer } from "../../../infrastructure/MessageBroker/kafka/producer/userCreatedProducer";
import { USER_ROLE } from "../../../shared/enums/role";
import { IgoogleAuthUseCase } from "../../interfaces/IgoogleAuthUseCase";
import { Password } from "../../services/passwordHash";
import axios from "axios";
import sharp from "sharp";

export class GoogelAuthUseCase implements IgoogleAuthUseCase {
  constructor(
    private jwtService: ItokenService,
    private userRepository: IuserRepository,
    private userCreatedProducer: UserCreatedProducer,
    private s3Service: Is3Service
  ) {}

  async execute(token: string, role: string): Promise<any> {
    try {
      const validat = await this.jwtService.verifyGoogleToken(token);

      if (!validat) {
        return {
          validat: true,
        };
      }

      const hashPassword = (await Password.toHash(validat.sub)) as string;

      const existUser = await this.userRepository.findByEmail(validat.email);
      let randomImageName: any;
      if (validat.picture) {
        try {
          const response = await axios.get(validat.picture, {
            responseType: "arraybuffer",
          });          
          const buffer = await sharp(response.data)
            .resize({ height: 300, width: 300, fit: "cover" })
            .toBuffer();

          randomImageName = Math.random() + Date.now();
          const uploadResponse = await this.s3Service.uploadImageToBucket(
            buffer,
            "image/jpeg",
            role == USER_ROLE.USER
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
      if (existUser && existUser.role == role) {
        const accessToken = this.jwtService.generateAccessToken(existUser);
        const refreshToken = this.jwtService.generateRefreshToken(existUser);
        return { success: true, accessToken, refreshToken, user: existUser };
      } else {
        // Creating new User
        const user = new User(
          validat.given_name,
          validat.email,
          hashPassword,
          role,
          false,
          randomImageName
        );
        const newUser = await this.userRepository.create(user);
        const accessToken = this.jwtService.generateAccessToken(user);
        const refreshToken = this.jwtService.generateRefreshToken(user);
        const data = {
          id: newUser.id as string,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          isAdmin: newUser.isAdmin,
          isBlocked: newUser.isBlocked,
          isGoogle: newUser.isGoogle,
          role: newUser.role as "user" | "admin" | "mentor",
        };
        await this.userCreatedProducer.produce(data); // producing message to kafka
        return { success: true, accessToken, refreshToken, user: newUser };
      }
    } catch (error) {
      console.error("Error from OTP varification : ", error);
      return { InternalServer: true, error };
    }
  }
}
