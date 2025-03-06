import { Router } from 'express';
import DecryptionController from '../controllers/DecryptionController';

class DecryptionRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/decrypt', DecryptionController.decryptData);
  }
}

export default new DecryptionRoutes().router;
