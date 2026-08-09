import mongoose from "mongoose";
import { Cart } from "@repo/db";
import { Photo } from "@repo/db";
import { Product } from "@repo/db";
import { CartTableResult, CartItem } from "@repo/api-client";
import { redis } from "@repo/redis";

export class CartService {
  private cartFeature = new Cart();
  private photoFeature = new Photo();
  private productFeature = new Product();

  private readonly CACHE_KEY_PREFIX = "cart:";
  private readonly CACHE_TTL = 300;

  // 生成缓存键
  private getCacheKey(userId: string): string {
    return `${this.CACHE_KEY_PREFIX}${userId}`;
  }

  // 使缓存失效
  async invalidateCartCache(userId: string): Promise<void> {
    const cacheKey = this.getCacheKey(userId);
    await redis.del(cacheKey);
  }

  async formatCart(userId: string): Promise<CartTableResult> {
    const cacheKey = this.getCacheKey(userId); 

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const objUserId = new mongoose.Types.ObjectId(userId);
    const data = await this.cartFeature.carts({ userId });

    if (!data) {
      return { userId: objUserId, items: [] };
    }

    const specIds = data.items.map((item) => item.specId._id.toString());
    const productIds = data.items.map((item) =>
      item.specId.productUuid.toString(),
    );
    const [photos, products] = await Promise.all([
      this.photoFeature.list({ specUuid: { $in: specIds } }),
      this.productFeature.list({ _id: { $in: productIds } }),
    ]);

    const photoMap = new Map(photos.map((p) => [p.specUuid.toString(), p]));
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const items: CartItem[] = data.items.map((item) => {
      const specId = item.specId._id.toString();
      const productId = item.specId.productUuid.toString();

      const foundPhoto = photoMap.get(specId) ?? null;
      const foundProduct = productMap.get(productId);

      return {
        productUuid: item.specId.productUuid,
        spec: item.specId.spec,
        rank: item.specId.rank ?? 0,
        originalPrice: item.specId.originalPrice,
        salePrice: item.specId.salePrice,
        stock: item.specId.stock,
        cost: item.specId.cost,
        vipPrice: item.specId.vipPrice,
        name: item.specId.name,
        quantity: item.quantity || 1,
        _id: item.specId._id,
        photo: foundPhoto ?? null,
        categoryName: foundProduct?.categoryName.toString(),
        categoryUuid: foundProduct?.categoryUuid.toString(),
      };
    });

    const result = { userId: objUserId, items };
    await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(result));
    return result;
  }

  async reFreshCart(userId: string) {
    await this.cartFeature.refreshCart(userId);
  }

  async cartUpdate(userId: string, specId: string, quantity: number) {
    await this.cartFeature.cartUpdate(userId, specId, quantity);
  }

  async cartClear(userId: string) {
    await this.cartFeature.cartClear(userId);
  }

  async getCart(userId: string) {
    return this.formatCart(userId);
  }

  async getCartData(userId: string) {
    return this.cartFeature.get({ userId });
  }
}
