import FavoriteService from "../../src/services/FavoriteService";
import FavoriteModel from "../../src/models/favoriteModel";
import RedisClient from "../../src/config/RedisConfig";

jest.mock("../../src/models/favoriteModel");
jest.mock("../../src/config/RedisConfig", () => ({
  getInstance: jest.fn().mockResolvedValue({
    del: jest.fn().mockResolvedValue(1),
  }),
}));

describe("FavoriteService", () => {
  let redisMock: any;

  beforeEach(async () => {
    redisMock = await RedisClient.getInstance();
    jest.clearAllMocks();
  });

  test("يجب أن يضيف مدينة إلى المفضلة إذا لم تكن موجودة", async () => {
    jest.spyOn(FavoriteModel, "findOne").mockResolvedValue(null);
    jest.spyOn(FavoriteModel, "create").mockResolvedValue({
      toObject: () => ({ userId: "123", city: "Cairo" }),
    } as any);

    await expect(
      FavoriteService.toggleFavorite("123", "Cairo")
    ).resolves.not.toThrow();

    expect(FavoriteModel.create).toHaveBeenCalledWith({
      userId: "123",
      city: "Cairo",
    });
    expect(redisMock.del).toHaveBeenCalledWith("favorites:123");
  });

  test("يجب أن يزيل المدينة من المفضلة إذا كانت موجودة", async () => {
    jest.spyOn(FavoriteModel, "findOne").mockResolvedValue({
      toObject: () => ({ _id: "abc123", userId: "123", city: "Cairo" }),
    } as any);

    jest
      .spyOn(FavoriteModel, "deleteOne")
      .mockResolvedValue({ acknowledged: true, deletedCount: 1 } as any);

    await expect(
      FavoriteService.toggleFavorite("123", "Cairo")
    ).resolves.not.toThrow();

    expect(FavoriteModel.deleteOne).toHaveBeenCalledWith({
      userId: "123",
      city: "Cairo",
    });
    expect(redisMock.del).toHaveBeenCalledWith("favorites:123");
  });
});
