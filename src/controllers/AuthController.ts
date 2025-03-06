import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService";

class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = req.body;
      const user = await AuthService.register(username, email, password);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      if (!token) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
