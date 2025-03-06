import AuthService from "../../src/services/AuthService";
import UserModel from "../../src/models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../src/models/UserModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("يجب أن يقوم بتسجيل مستخدم جديد", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue(null);
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never);
    jest.spyOn(UserModel.prototype, "save").mockResolvedValue({
      id: "123",
      email: "test@example.com",
    });

    const user = await AuthService.register(
      "testuser",
      "test@example.com",
      "password"
    );

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("email", "test@example.com");
  });

  test("يجب أن يُرجع JWT عند تسجيل الدخول بنجاح", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue({
      _id: "123",
      email: "test@example.com",
      password: "hashedPassword",
    });

    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
    jest.spyOn(jwt, "sign").mockReturnValue("fakeToken" as never);

    const token = await AuthService.login("test@example.com", "password");

    expect(token).toBe("fakeToken");
  });
});
