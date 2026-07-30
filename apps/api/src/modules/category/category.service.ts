// apps/api/src/features/category/category.service.ts
import { Category } from "@repo/db";
import {
  CategoryAddParams,
  CategoryGetParams,
  CategoryUpdateParams,
} from "@repo/db";
import { Product } from "@repo/db";
import { redis } from "@repo/redis";
import { SortOrder } from "mongoose";

export class CategoryService {
  private categoryFeature = new Category();
  private productFeature = new Product();

  private readonly CACHE_KEY_PREFIX = "category:list";
  private readonly CACHE_TTL = 86400;

  private getCacheKey(filter: CategoryGetParams, sort?: any): string {
    const filterString = JSON.stringify(filter);
    const sortString = JSON.stringify(sort || {});
    return `${this.CACHE_KEY_PREFIX}:${filterString}:${sortString}`;
  }

  async invalidateCache(): Promise<void> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:*`;
    const keys = await redis.keys(cacheKey);
    
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  async list(
    filter: CategoryGetParams = {},
    sort?: { [key: string]: SortOrder },
  ) {
    const cacheKey = this.getCacheKey(filter, sort);

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await this.categoryFeature.list(filter, sort);
    await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(result));

    return result;
  }

  async add(params: CategoryAddParams) {
    const res = await this.categoryFeature.add(params);
    await this.invalidateCache();
    return res;
  }

  async update(id: string, params: Partial<CategoryUpdateParams>) {
    const newCate = await this.categoryFeature.update({ _id: id }, params);
    this.productFeature.updateMany(
      { categoryUuid: newCate.data._id.toString() },
      { categoryName: newCate.data.name },
    );
    await this.invalidateCache();
    return newCate;
  }

  async delete(id: string) {
    await this.invalidateCache();
    return this.categoryFeature.deleteCategory(id);
  }
}
