import { Request, Response, NextFunction } from "express";
import FavoriteService from "../services/FavoriteService";
import WeatherService from "../services/WeatherService";
import EncryptionService from "../services/EncryptionService";
import Logger from "../utils/Logger";
import { IAuthRequest } from "../interfaces/IAuthRequest";

class FavoriteController {
  public async addFavorite(
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: any = req.user?.id;
      const { city } = req.body;

      if (!city) {
        res.status(400).json({ error: "City is required" });
        return;
      }

      await FavoriteService.toggleFavorite(userId, city);
      res.status(201).json({ message: "City added to favorites" });
    } catch (error) {
      Logger.error("Error adding favorite city:", error as Error);
      next(error);
    }
  }

  public async getFavorites(
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: any = req.user?.id;
      const favoriteCities = await FavoriteService.getFavorites(userId);

      const weatherSummaries = await Promise.all(
        favoriteCities.map(async (city) => {
          const weatherData = await WeatherService.getWeatherByCity(city);
          return { city, weather: JSON.parse(weatherData) };
        })
      );

      const encryptedResponse = EncryptionService.encrypt(
        JSON.stringify(weatherSummaries)
      );
      res.status(200).json({ data: encryptedResponse });
    } catch (error) {
      Logger.error("Error retrieving favorite cities:", error as Error);
      next(error);
    }
  }
}

export default new FavoriteController();
