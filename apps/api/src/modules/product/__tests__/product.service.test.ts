import { redis } from "@repo/redis";
import { ProductService } from "../product.service";

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
  Product: jest.fn().mockImplementation(() => ({
    createProduct: jest.fn(),
    UpdateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    getData: jest.fn(),
  })),
  SpecInventory: jest.fn().mockImplementation(() => ({
    deleteSpecInventory: jest.fn(),
  })),
  Photo: jest.fn().mockImplementation(() => ({})),
}));

const mockedRedis = jest.mocked(redis);

describe("商品服務", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("快取命中時直接回傳商品列表，不查詢資料庫", async () => {
    const cachedProducts = [{ product: { name: "cached" } }];
    mockedRedis.get.mockResolvedValue(JSON.stringify(cachedProducts));

    const service = new ProductService();
    const result = await service.list({ categoryName: "Dessert" } as any);

    const { Product } = jest.requireMock("@repo/db");
    expect(result).toEqual(cachedProducts);
    expect(Product.mock.results[0].value.getData).not.toHaveBeenCalled();
  });

  it("快取未命中時載入商品列表，並寫入 Redis", async () => {
    const products = [{ product: { name: "Cotton Candy" } }];
    const filter = { categoryName: "Dessert" };
    mockedRedis.get.mockResolvedValue(null);

    const service = new ProductService();
    const { Product } = jest.requireMock("@repo/db");
    Product.mock.results[0].value.getData.mockResolvedValue(products);

    const result = await service.list(filter as any);

    expect(result).toEqual(products);
    expect(Product.mock.results[0].value.getData).toHaveBeenCalledWith(filter);
    expect(mockedRedis.setex).toHaveBeenCalledWith(
      expect.stringContaining(JSON.stringify(filter)),
      86400,
      JSON.stringify(products),
    );
  });

  it("刪除商品前會先清除商品列表快取", async () => {
    mockedRedis.keys.mockResolvedValue(["product:list:{a}", "product:list:{b}"]);
    const deletedProduct = { data: { _id: "product-1" } };

    const service = new ProductService();
    const { Product } = jest.requireMock("@repo/db");
    Product.mock.results[0].value.deleteProduct.mockResolvedValue(deletedProduct);

    const result = await service.delete("product-1");

    expect(mockedRedis.keys).toHaveBeenCalledWith("product:list:*");
    expect(mockedRedis.del).toHaveBeenCalledWith("product:list:{a}", "product:list:{b}");
    expect(Product.mock.results[0].value.deleteProduct).toHaveBeenCalledWith("product-1");
    expect(result).toBe(deletedProduct);
  });

  it("刪除規格前會先清除商品列表快取", async () => {
    mockedRedis.keys.mockResolvedValue(["product:list:{a}"]);
    const deletedSpec = { data: { _id: "spec-1" } };

    const service = new ProductService();
    const { SpecInventory } = jest.requireMock("@repo/db");
    SpecInventory.mock.results[0].value.deleteSpecInventory.mockResolvedValue(deletedSpec);

    const result = await service.deleteSpec("product-1", "spec-1");

    expect(mockedRedis.del).toHaveBeenCalledWith("product:list:{a}");
    expect(SpecInventory.mock.results[0].value.deleteSpecInventory).toHaveBeenCalledWith(
      "product-1",
      "spec-1",
    );
    expect(result).toBe(deletedSpec);
  });
});
