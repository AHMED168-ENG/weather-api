import mongoose from "mongoose";
import Logger from "../utils/Logger";
import { ServiceUnavailableError } from "../utils/CustomErrors";
import FavoriteModel from "../models/favoriteModel";
import RedisClient from "../config/RedisConfig";

interface IFavoriteService {
  toggleFavorite(userId: string, city: string): Promise<void>;
  getFavorites(userId: string): Promise<string[]>;
}

class FavoriteService implements IFavoriteService {
  private redisClient: any;

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      this.redisClient = await RedisClient.getInstance();
    } catch (error) {
      Logger.error("Error initializing Redis:", error as Error);
    }
  }

  public async toggleFavorite(userId: string, city: string): Promise<void> {
    try {
      const key = `favorites:${userId}`;
      const existingFavorite = await FavoriteModel.findOne({ userId, city });

      if (existingFavorite) {
        await FavoriteModel.deleteOne({ userId, city });
        Logger.info(`Removed favorite city: ${city} for user: ${userId}`);
      } else {
        await FavoriteModel.create({ userId, city });
        Logger.info(`Added favorite city: ${city} for user: ${userId}`);
      }

      if (this.redisClient) {
        await this.redisClient.del(key);
      }
    } catch (error) {
      Logger.error("Error toggling favorite:", error as Error);
      throw new ServiceUnavailableError("Failed to update favorite cities");
    }
  }

  public async getFavorites(userId: string): Promise<string[]> {
    try {
      const key = `favorites:${userId}`;

      let favorites = [];
      if (this.redisClient) {
        favorites = await this.redisClient.sMembers(key);
        if (favorites.length > 0) {
          Logger.info(`Cache hit for user: ${userId}`);
          return favorites;
        }
      }

      Logger.info(`Cache miss for user: ${userId}, fetching from DB`);
      const dbFavorites = await FavoriteModel.find({ userId });

      favorites = dbFavorites.map((fav) => fav.city);

      if (favorites.length > 0 && this.redisClient) {
        await this.redisClient.sAdd(key, ...favorites);
      }

      return favorites;
    } catch (error) {
      Logger.error("Error retrieving favorites:", error as Error);
      throw new ServiceUnavailableError("Failed to retrieve favorite cities");
    }
  }

  public async shutdown(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
      Logger.info("Redis connection closed.");
    }
  }
}

export default new FavoriteService();
