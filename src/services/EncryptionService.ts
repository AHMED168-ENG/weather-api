import crypto from "crypto";

interface IEncryptionService {
  encrypt(text: string): string;
  decrypt(encryptedText: string): string;
}

export class EncryptionService implements IEncryptionService {
  private static readonly ALGORITHM = "aes-256-cbc";
  private static readonly SECRET_KEY = crypto.scryptSync(
    process.env.ENCRYPTION_KEY || "default_secret_key",
    "salt",
    32
  );
  private static readonly IV = Buffer.alloc(16, 0);

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(
      EncryptionService.ALGORITHM,
      EncryptionService.SECRET_KEY,
      EncryptionService.IV
    );
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(
      EncryptionService.ALGORITHM,
      EncryptionService.SECRET_KEY,
      EncryptionService.IV
    );
    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
  }
}

export default new EncryptionService();
