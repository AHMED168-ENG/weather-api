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
        res.status(400).json({ error: "City parameter is required" });
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
}

export default new WeatherController();
