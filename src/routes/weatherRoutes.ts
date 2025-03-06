import { Router } from "express";
import WeatherController from "../controllers/WeatherController";

const router: Router = Router();

router.get("/weather", WeatherController.getWeatherByCity);
router.get("/weather/coordinates", WeatherController.getWeatherByCoordinates);

export default router;
