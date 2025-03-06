import { NextFunction, Request, Response } from "express";
import WeatherService from "../services/WeatherService";
import Logger from "../utils/Logger";
import EncryptionService from "../services/EncryptionService";

class WeatherController {
  public async getWeatherByCity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const city: string = req.query.city as string;
      if (!city) {
        res.status(400).json({ error: "City query parameter is required" });
        return;
      }

      const weatherData: any = await WeatherService.getWeatherByCity(city);
      const encryptedResponse = EncryptionService.encrypt(weatherData);
      res.status(200).json(encryptedResponse);
    } catch (error) {
      Logger.error("Error in WeatherController:", error as Error);
      next(error);
    }
  }

  public async getWeatherByCoordinates(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      if (isNaN(lat) || isNaN(lon)) {
        res.status(400).json({
          error:
            "Latitude and Longitude are required and must be valid numbers",
        });
        return;
      }

      const weatherData: any = await WeatherService.getWeatherByCoordinates(
        lat,
        lon
      );
      const encryptedResponse = EncryptionService.encrypt(weatherData);
      res.status(200).json(encryptedResponse);
    } catch (error) {
      Logger.error("Error in WeatherController:", error as Error);
      next(error);
    }
  }
}

export default new WeatherController();
