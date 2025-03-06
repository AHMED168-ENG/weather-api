import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Logger from "../utils/Logger";

class AuthMiddleware {
  public verifyToken(req: any, res: Response, next: NextFunction): void {
    try {
      const token: string | undefined =
        req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
        return;
      }
      const secretKey: string = process.env.JWT_SECRET || "default_secret";
      const decoded: JwtPayload | string = jwt.verify(token, secretKey);
      if (typeof decoded === "string") {
        res.status(401).json({ error: "Unauthorized: Invalid token" });
        return;
      }

      req.user = decoded;
      console.log(req.user);
      next();
    } catch (error) {
      console.log(error);
      Logger.error("Authentication error:", error as Error);
      res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
  }
}

export default new AuthMiddleware();
