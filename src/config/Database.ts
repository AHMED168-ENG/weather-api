import mongoose from "mongoose";
import dotenv from "dotenv";
import Logger from "../utils/Logger";

dotenv.config();

export class Database {
  private static instance: Database;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      const MONGO_URI = process.env.MONGO_URI as string;
      if (!MONGO_URI) {
        throw new Error(" MongoDB URI not found in environment variables!");
      }

      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions);

      Logger.info("✅ Connected to MongoDB successfully");
    } catch (error) {
      Logger.error(` MongoDB connection error: ${error}`);
      process.exit(1);
    }
  }
}
