import WeatherService from "../../src/services/WeatherService";
import axios from "axios";
import RedisClient from "../../src/config/RedisConfig";

jest.mock("axios", () => {
  const axiosInstance = {
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  return {
    create: jest.fn(() => axiosInstance),
    default: axiosInstance,
  };
});

jest.mock("../../src/config/RedisConfig", () => ({
  instance: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  },
}));

describe("WeatherService", () => {
  test("يجب أن يجلب بيانات الطقس لمدينة معينة", async () => {
    (axios.create().get as jest.Mock).mockResolvedValue({ data: { temp: 25 } });

    const weatherData = await WeatherService.getWeatherByCity("Cairo");
    expect(JSON.parse(weatherData)).toHaveProperty("temp", 25);
  });

  test("يجب أن يتعامل مع خطأ API بشكل صحيح", async () => {
    (axios.create().get as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(WeatherService.getWeatherByCity("Cairo")).rejects.toThrow(
      "Failed to retrieve weather data"
    );
  });
  // afterAll(async () => {
  //   const redisClient = await RedisClient.getInstance(); // ✅ ننتظر حل الـ Promise
  //   await redisClient.disconnect(); // ✅ الآن يمكن استدعاء `disconnect()`
  // });
});
