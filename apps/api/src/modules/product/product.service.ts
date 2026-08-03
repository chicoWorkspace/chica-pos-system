import { Product } from "@repo/db";
import { SpecInventory } from "@repo/db";
import { Photo } from "@repo/db";
import { ProductGetParams } from "@repo/api-client";
import { FilterQuery } from "mongoose";
import { CreateProductRequest, UpdateProductRequest } from "./product.schema";
import { redis } from "@repo/redis";

export class ProductService {
  private productFeature = new Product();
  private specFeature = new SpecInventory();
  private photoFeature = new Photo();

  private readonly CACHE_KEY_PREFIX = "product:list";
  private readonly CACHE_TTL = 86400;

  private getCacheKey(filter: ProductGetParams): string {
    const filterString = JSON.stringify(filter);
    return `${this.CACHE_KEY_PREFIX}:${filterString}`;
  }

  async invalidateCache(): Promise<void> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:*`;
    const keys = await redis.keys(cacheKey);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  async create(payload: CreateProductRequest) {
    const { product, specInventories, photos } = payload;
    await this.invalidateCache();
    return this.productFeature.createProduct(
      product,
      specInventories,
      photos ?? [],
    );
  }

  async update(payload: UpdateProductRequest) {
    const { product, specInventories, photos } = payload;
    await this.invalidateCache();
    return this.productFeature.UpdateProduct(
      product,
      specInventories,
      photos ?? [],
    );
  }

  async delete(id: string) {
    await this.invalidateCache();
    return this.productFeature.deleteProduct(id);
  }

  async list(filter: FilterQuery<ProductGetParams>) {
    const cacheKey = this.getCacheKey(filter);

    const cached = await redis.get(cacheKey);
    if (cached) {
      
      return JSON.parse(cached);
    }

    const result = await this.productFeature.getData(filter);
    await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(result));

    return result;
  }

  async deleteSpec(productId: string, specId: string) {
    await this.invalidateCache();
    return this.specFeature.deleteSpecInventory(productId, specId);
  }
}
