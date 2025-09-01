// import {
//   BadRequest,
//   UpdateSubscriptionRequest,
//   UpdateSubscriptionResponse,
// } from "@buxlo/common";
// import * as grpc from "@grpc/grpc-js";
// import * as protoLoader from "@grpc/proto-loader";
// import path from "path";
// import { UserRepository } from "../../repositories/userRepository";

// const PROTO_PATH = path.join(
//   __dirname,
//   "../../../../node_modules/@buxlo/common/src/protos/payment.proto"
// );

// // Load proto definition
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });

// const paymentProto = (grpc.loadPackageDefinition(packageDefinition) as any)
//   .payment;

// class SubscriptionServiceGrpc {
//   private _server: grpc.Server;
//   private _port: number;

//   constructor(port: number) {
//     this._server = new grpc.Server();
//     this._port = port;
//     this._initializeService();
//   }

//   private _initializeService() {
//     const subscriptionService = {
//       UpdateSubscription: async (
//         call: grpc.ServerUnaryCall<
//           UpdateSubscriptionRequest,
//           UpdateSubscriptionResponse
//         >,
//         callback: grpc.sendUnaryData<UpdateSubscriptionResponse>
//       ) => {
//         const { userId, isPremium, premiumEndDate } = call.request;
//         console.log("++++++++++++++++",userId,isPremium,premiumEndDate);
        

//         const userRepo = new UserRepository();
//         try {
//           if (!userId) throw new BadRequest("Id is required");
//           if (isPremium === undefined)
//             throw new BadRequest("isPremium is required");

//           const existingUser = await userRepo.getUserDetails(userId);
//           if (!existingUser) {
//             return callback(
//               { code: grpc.status.NOT_FOUND, message: "User not found" },
//               null
//             );
//           }

//           const updatedUser = await userRepo.update(userId, {
//             isPremium,
//           });

//           return callback(null, {
//             userId: updatedUser!.id,
//             success: true,
//           });
//         } catch (error: any) {
//           console.error("Error updating subscription:", error.message);
//           return callback(
//             { code: grpc.status.INTERNAL, message: "Update failed" },
//             null
//           );
//         }
//       },
//     };

//     this._server.addService(
//       paymentProto.SubscriptionService.service,
//       subscriptionService
//     );
//   }

//   public start(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this._server.bindAsync(
//         `0.0.0.0:${this._port}`,
//         grpc.ServerCredentials.createInsecure(),
//         (err) => {
//           if (err) return reject(err);
//           console.log(`Booking gRPC Service running on port ${this._port}`);
//           this._server.start();
//           resolve();
//         }
//       );
//     });
//   }
// }

// export const grpcSubscriptionService = new SubscriptionServiceGrpc(
//   Number(process.env.GRPC_PAYMENT_PORT) || 50054
// );
