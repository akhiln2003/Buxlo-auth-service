import { createClient } from "redis";

class Redis {
  private readonly _redisClient: ReturnType<typeof createClient>;
  constructor() {
    this._redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    });
    this._redisClient.on("error", (err) => {
      console.log("Redis client error", err);
    });
  }

  public async connect(): Promise<void> {
    await this._redisClient.connect();
    console.log("connected to redis");
  }
  public getClient() {
    return this._redisClient;
  }
}

export const redisClientInstance = new Redis();
