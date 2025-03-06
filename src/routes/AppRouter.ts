import { Router } from 'express';
import AuthRoutes from './authRoutes';
import FavoriteRoutes from './favoriteRoutes';
import WeatherRoutes from './weatherRoutes';
import DecryptionRoutes from './DecryptionRoutes';

class AppRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use('/auth', AuthRoutes);
    this.router.use('/weather', WeatherRoutes);
    this.router.use('/favorite', FavoriteRoutes);
    this.router.use('/decrypt', DecryptionRoutes);

  }
}

export default new AppRouter().router;
