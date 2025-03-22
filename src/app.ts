import { errorHandler } from "@buxlo/common";
import { IServer } from "./domain/interfaces/Iserver";
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

export class App {
  constructor(private server: IServer) {}

  async initialize(): Promise<void> {
    await this.connectDB();
    await this.connectKafka();
    this.registerMiddleware();
    this.registerRoutes();
    this.registerErrorHandler();
  }

  private registerMiddleware(): void {
    this.server.registerMiddleware(loggerMiddleware);
  }
  registerRoutes(): void {
    const userRoutes = new UserRouter().getRouter();
    const mentorRoutes = new MentorRouter().getRouter();
    const adminRoutes = new AdminRouter().getRouter();
    this.server.registerRoutes("/api/auth/user", userRoutes);
    this.server.registerRoutes("/api/auth/mentor", mentorRoutes);
    this.server.registerRoutes("/api/auth/admin", adminRoutes);
  }

  private registerErrorHandler(): void {
    this.server.registerErrorHandler(errorHandler as any);
  }

  async start(port: number): Promise<void> {
    await this.server.start(port);
  }

  async shutdown(): Promise<void> {
    await disconnectDB();
    await messageBroker.disconnect();
    console.log("Shut dow server");
  }
  private async connectDB() {
    try {
      await connectDB();
      await redisClientInstance.connect();
    } catch (error) {
      console.log("Server could not be started", error);
      process.exit(1);
    }
  }
  private async connectKafka(): Promise<void> {
    await messageBroker.connect();
  }
}

export default App;
