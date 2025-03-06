import { Router } from 'express';
import WeatherController from '../controllers/WeatherController';

const router: Router = Router();

router.get('/weather', WeatherController.getWeatherByCity);

export default router;