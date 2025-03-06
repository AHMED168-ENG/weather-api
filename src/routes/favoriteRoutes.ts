import { Router } from 'express';
import FavoriteController from '../controllers/FavoriteController';
import AuthMiddleware from '../middleware/AuthMiddleware';

class FavoriteRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/favorites', AuthMiddleware.verifyToken, FavoriteController.addFavorite);
    this.router.get('/favorites', AuthMiddleware.verifyToken, FavoriteController.getFavorites);
  }
}

export default new FavoriteRoutes().router;
