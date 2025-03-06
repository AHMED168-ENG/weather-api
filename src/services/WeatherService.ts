import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import RedisClient from "../config/RedisConfig";
import Logger from "../utils/Logger";
import { ConfigService } from "../config/ConfigService";
import { ServiceUnavailableError } from "../utils/CustomErrors";

class WeatherService {
  private apiKey: string;
  private apiUrl: string;
  private httpClient: AxiosInstance;
  private redisClient: any;

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || "";
    this.apiUrl = "https://api.openweathermap.org/data/2.5/weather";
    this.httpClient = axios.create({
      baseURL: this.apiUrl,
      timeout: 5000,
    });
    // التأكد من أن `httpClient` صالح قبل تطبيق axiosRetry
    if (this.httpClient) {
      axiosRetry(this.httpClient, {
        retries: 3,
        retryDelay: (retryCount) => retryCount * 1000,
        retryCondition: (error: any) => error.response?.status >= 500,
      });
    }

    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      this.redisClient = await RedisClient.getInstance();
    } catch (error) {
      Logger.error("Error initializing Redis:", error as Error);
    }
  }

  private async getCachedWeather(city: string): Promise<string | null> {
    if (!this.redisClient) return null;
    try {
      return await this.redisClient.get(`weather:${city}`);
    } catch (error) {
      Logger.error("Error retrieving from Redis:", error as Error);
      return null;
    }
  }

  private async setCachedWeather(city: string, data: string): Promise<void> {
    if (!this.redisClient) return;
    try {
      await this.redisClient.setEx(`weather:${city}`, 600, data);
    } catch (error) {
      Logger.error("Error setting cache in Redis:", error as Error);
    }
  }

  public async getWeatherByCity(city: string): Promise<string> {
    try {
      const cachedData = await this.getCachedWeather(city);
      if (cachedData) {
        Logger.info(`Cache hit for city: ${city}`);
        return cachedData;
      }

      const response = await this.httpClient.get("", {
        params: { q: city, appid: this.apiKey, units: "metric" },
      });

      const responseData = JSON.stringify(response.data);
      await this.setCachedWeather(city, responseData);
      return responseData;
    } catch (error: any) {
      Logger.error(
        `Error fetching weather data for ${city}: ${error.message}`,
        error.response?.data || error
      );
      throw new ServiceUnavailableError("Failed to retrieve weather data");
    }
  }

  public async getWeatherByCoordinates(
    lat: number,
    lon: number
  ): Promise<string> {
    try {
      const response = await this.httpClient.get("", {
        params: { lat, lon, appid: this.apiKey, units: "metric" },
      });

      return JSON.stringify(response.data);
    } catch (error: any) {
      Logger.error(
        `Error fetching weather by coordinates (${lat}, ${lon}): ${error.message}`,
        error.response?.data || error
      );
      throw new ServiceUnavailableError("Failed to retrieve weather data");
    }
  }

  public async shutdown(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
      Logger.info("Redis connection closed.");
    }
  }
}

export default new WeatherService();
