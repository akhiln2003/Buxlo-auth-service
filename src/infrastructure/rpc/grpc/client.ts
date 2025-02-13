import {
  CreateUserProfileRequest,
  CreateUserProfileResponse,
} from "@buxlo/common";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(
  __dirname,
  "../../../../node_modules/@buxlo/common/src/protos/auth.proto"
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});

// convert into grpc obje with what we neamed definition in there
const userProto = (grpc.loadPackageDefinition(packageDefinition) as any).user;

export const client = new userProto.UserService(
  process.env.GRPC_SERVER || "localhost:50051",
  grpc.credentials.createInsecure()
);

export const registerUser = (
  userData: CreateUserProfileRequest
): Promise<CreateUserProfileResponse> => {
  return new Promise((res, rej) => {
    // when call this it convert to binar
    client.createUserProfile(userData, (error: any, response: any) => {
        
      if (error) {
        console.error("gRPC Error:", error);
        rej(error);
        return;
      }
      console.log("gRPC response : " , response);
      res(response);
      
    });
  });
};
