import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel, { IUser } from "../models/UserModel";

export class AuthService {
  constructor() {}

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<IUser> {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, email, password: hashedPassword });

    return user.save();
  }

  async login(email: string, password: string): Promise<string | null> {
    const user: any = await UserModel.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return null;
    }
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
  }
}

export default new AuthService();
