import { createClient, RedisClientType } from "redis";
import Logger from "../utils/Logger";

class RedisClient {
  private static instance: RedisClientType | null = null;

  private constructor() {}

  public static async getInstance(): Promise<RedisClientType> {
    if (!RedisClient.instance) {
      RedisClient.instance = createClient({
        socket: { host: process.env.REDIS_HOST || "localhost", port: 6379 },
      });

      RedisClient.instance.on("error", (err) =>
        Logger.error("Redis Error:", err)
      );

      await RedisClient.instance.connect();
      Logger.info("Connected to Redis");
    }

    return RedisClient.instance;
  }

  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.disconnect(); // ✅ تأكد من فصل الاتصال
      this.instance = null; // ✅ إعادة التهيئة لضمان عدم بقاء الاتصال
    }
  }
}

export default RedisClient;
