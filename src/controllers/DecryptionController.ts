import { Request, Response, NextFunction } from "express";
import EncryptionService from "../services/EncryptionService";

class DecryptionController {
  /**
   * فك تشفير البيانات وإرجاعها إلى الـ Frontend
   */
  public async decryptData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { encryptedData }: { encryptedData: string } = req.body;

      if (!encryptedData) {
        res.status(400).json({ error: "encryptedData is required" });
        return;
      }
      const decryptedData = EncryptionService.decrypt(encryptedData);
      res.status(200).json({ data: decryptedData });
    } catch (error) {
      next(error);
    }
  }
}

export default new DecryptionController();
