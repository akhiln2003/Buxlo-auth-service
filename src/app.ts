import { errorHandler } from "@buxlo/common";
import { IServer } from "./domain/interfaces/IServer";
import {
  connectDB,
  disconnectDB,
} from "./infrastructure/database/mongodb/connection";
import { redisClientInstance } from "./infrastructure/database/redis/connection";
import loggerMiddleware from "./presentation/middlewares/loggerMiddleware";
import { messageBroker } from "./infrastructure/MessageBroker/config";
import { AdminRouter } from "./presentation/routes/adminAuthRouts";
import { UserRouter } from "./presentation/routes/userAuthRouts";
import { MentorRouter } from "./presentation/routes/mentorAuthRouts";
import { CommonRouter } from "./presentation/routes/commonAuthRouts";
// import { grpcSubscriptionService } from "./infrastructure/rpc/grpc/subscriptionService";

export class App {
  constructor(private _server: IServer) {}

  async initialize(): Promise<void> {
    await this._connectDB();
    // await this._connectGrpc();
    await this._connectKafka();
    this._registerMiddleware();
    this.registerRoutes();
    this._registerErrorHandler();
  }

  private _registerMiddleware(): void {
    this._server.registerMiddleware(loggerMiddleware);
  }
  registerRoutes(): void {
    const userRoutes = new UserRouter().getRouter();
    const mentorRoutes = new MentorRouter().getRouter();
    const adminRoutes = new AdminRouter().getRouter();
    const commonRoutes = new CommonRouter().getRouter();

    this._server.registerRoutes("/api/auth/user", userRoutes);
    this._server.registerRoutes("/api/auth/mentor", mentorRoutes);
    this._server.registerRoutes("/api/auth/admin", adminRoutes);
    this._server.registerRoutes("/api/auth/common", commonRoutes);
  }

  private _registerErrorHandler(): void {
    this._server.registerErrorHandler(errorHandler as any);
  }

  async start(port: number): Promise<void> {
    await this._server.start(port);
  }

  async shutdown(): Promise<void> {
    await disconnectDB();
    await messageBroker.disconnect();
    console.log("Shut dow server");
  }
  private async _connectDB() {
    try {
      await connectDB();
      await redisClientInstance.connect();
    } catch (error) {
      console.log("Server could not be started", error);
      process.exit(1);
    }
  }
  private async _connectKafka(): Promise<void> {
    await messageBroker.connect();
  }

  // private async _connectGrpc(): Promise<void> {
  //   try {
  //     await grpcSubscriptionService.start();
  //     console.log("gRPC server started successfully.");
  //   } catch (error) {
  //     console.error("Failed to start gRPC server:", error);
  //   }
  // }
}

export default App;
