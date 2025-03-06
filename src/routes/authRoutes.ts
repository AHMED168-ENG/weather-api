import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { ValidationMiddleware } from "../validation/ValidationMiddleware";
import { validateRequest } from "../middleware/ValidateRequest";

class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/register",
      ValidationMiddleware.registerValidation(),
      validateRequest,
      AuthController.register
    );
    this.router.post(
      "/login",
      ValidationMiddleware.loginValidation(),
      validateRequest,
      AuthController.login
    );
  }
}

export default new AuthRoutes().router;
