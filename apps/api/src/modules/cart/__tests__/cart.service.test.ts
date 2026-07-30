import mongoose from "mongoose";
import { redis } from "@repo/redis";
import { CartService } from "../cart.service";

jest.mock("@repo/redis", () => ({
  redis: {
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
  },
}));

jest.mock("@repo/db", () => ({
  Cart: jest.fn().mockImplementation(() => ({
    carts: jest.fn(),
    refreshCart: jest.fn(),
    cartUpdate: jest.fn(),
    get: jest.fn(),
  })),
  Photo: jest.fn().mockImplementation(() => ({
    list: jest.fn(),
  })),
  Product: jest.fn().mockImplementation(() => ({
    list: jest.fn(),
  })),
}));

const mockedRedis = jest.mocked(redis);

describe("購物車服務", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("快取命中時直接回傳購物車，不查詢資料庫功能", async () => {
    const cachedCart = { userId: "user-1", items: [{ name: "cached" }] };
    mockedRedis.get.mockResolvedValue(JSON.stringify(cachedCart));

    const service = new CartService();
    const result = await service.formatCart(new mongoose.Types.ObjectId().toString());

    const { Cart, Photo, Product } = jest.requireMock("@repo/db");
    expect(result).toEqual(cachedCart);
    expect(Cart.mock.results[0].value.carts).not.toHaveBeenCalled();
    expect(Photo.mock.results[0].value.list).not.toHaveBeenCalled();
    expect(Product.mock.results[0].value.list).not.toHaveBeenCalled();
  });

  it("快取未命中時格式化購物車，並寫入 Redis", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const productUuid = new mongoose.Types.ObjectId();
    const specUuid = new mongoose.Types.ObjectId();
    const categoryUuid = new mongoose.Types.ObjectId();
    const photo = { specUuid, filename: "cotton-candy.png" };
    const product = {
      _id: productUuid,
      categoryName: "Dessert",
      categoryUuid,
    };

    mockedRedis.get.mockResolvedValue(null);

    const service = new CartService();
    const { Cart, Photo, Product } = jest.requireMock("@repo/db");
    Cart.mock.results[0].value.carts.mockResolvedValue({
      items: [
        {
          quantity: 2,
          specId: {
            _id: specUuid,
            productUuid,
            spec: "large",
            rank: 3,
            originalPrice: 120,
            salePrice: 100,
            stock: 10,
            cost: 50,
            vipPrice: 90,
            name: "Large Cotton Candy",
          },
        },
      ],
    });
    Photo.mock.results[0].value.list.mockResolvedValue([photo]);
    Product.mock.results[0].value.list.mockResolvedValue([product]);

    const result = await service.formatCart(userId);

    expect(Cart.mock.results[0].value.carts).toHaveBeenCalledWith({ userId });
    expect(Photo.mock.results[0].value.list).toHaveBeenCalledWith({
      specUuid: { $in: [specUuid.toString()] },
    });
    expect(Product.mock.results[0].value.list).toHaveBeenCalledWith({
      _id: { $in: [productUuid.toString()] },
    });
    expect(result.items).toEqual([
      expect.objectContaining({
        _id: specUuid,
        productUuid,
        quantity: 2,
        photo,
        categoryName: "Dessert",
        categoryUuid: categoryUuid.toString(),
      }),
    ]);
    expect(mockedRedis.setex).toHaveBeenCalledWith(
      `cart:${userId}`,
      300,
      JSON.stringify(result),
    );
  });

  it("清除指定使用者的購物車快取 key", async () => {
    const userId = "user-1";
    const service = new CartService();

    await service.invalidateCartCache(userId);

    expect(mockedRedis.del).toHaveBeenCalledWith(`cart:${userId}`);
  });
});
