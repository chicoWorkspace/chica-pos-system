import {
  CartUpdateParams as apiCartUpdateParams,
  CartDeleteParams,
  CartItem,
  CartOrderParams,
  CartResult,
  CartTableResult,
} from "@repo/api-client";
import { Cart } from "@repo/db";
import { CartGetParams } from "@repo/db";
import { Photo } from "@repo/db";
import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../auth/authMiddleware";
import { AuthRequest } from "../types";
import { Product } from "@repo/db";
import { PhotosProps } from "@repo/api-client/";
import { OrderCreaterBag } from "@repo/api-client";
import { redis } from "@repo/redis";

const router = Router();

router.post("/order", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const params: CartOrderParams = req.body;
    const paymentMethod = params.paymentMethod;

    const featureCart = new Cart();
    if (userId === undefined) {
      return res.status(400).json({
        status: "error",
        data: null,
        error: "查無使用者資訊, 請重新登入",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        status: "error",
        data: null,
        error: "缺少必要資訊 paymentMethod",
      });
    }

    const lockKey = `order:lock:${userId}`;
    const existing = await redis.get(lockKey);
    if (existing) {
      // return res.status(400).json({ message: "訂單正在處理中，請稍後再試" });
    }

    const cart = await featureCart.get({ userId });
    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ message: "購物車為空，請先將商品添加入購物車" });
    }

    //建立鎖
    await redis.set(lockKey, "locked", "EX", 10);

    const order: OrderCreaterBag = {
      orderNumber: new Date().getTime().toString(),
      userId,
      paymentMethod,
      items: cart.items,
    };

    // await orderQueue.add("processOrder", { ...order });

    res.json({
      status: "success",
      data: null,
      error: null,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      data: null,
      error: err.message,
    });
  }
});

/**
 * 取得目前使用者購物車
 */
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const cartFeature = new Cart();
    const photoFeature = new Photo();
    const userId = req.user?.id;

    if (userId === undefined) {
      return res.status(400).json({
        status: "error",
        data: null,
        error: "查無使用者資訊, 請重新登入",
      });
    }
    const objUserId = new mongoose.Types.ObjectId(userId);
    const filter: CartGetParams = {
      userId: objUserId,
    };

    await cartFeature.refreshCart(userId);

    const result = await formatCart(userId);

    res.json({
      status: "success",
      data: result,
      error: null,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      data: null,
      error: err.message,
    });
  }
});

/**
 * 更新購物車商品數量
 */
router.patch("/:specId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const cartFeature = new Cart();
    const photoFeature = new Photo();

    const userId = req.user?.id;
    const specId = req.params.specId;
    const { quantity }: apiCartUpdateParams = req.body;

    if (userId === undefined) {
      return res.status(400).json({
        status: "error",
        data: null,
        error: "查無使用者資訊, 請重新登入",
      });
    }

    if (!quantity) {
      return res.status(400).json({
        status: "error",
        data: null,
        error: "缺少必要欄位 quantity或specId",
      });
    }
    await cartFeature.refreshCart(userId);
    const newCart = await cartFeature.cartUpdate(userId, specId, quantity);

    const result = await formatCart(userId);

    res.json({
      status: "success",
      data: result,
      error: null,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      data: null,
      error: err.message,
    });
  }
});

/**
 * 移除購物車商品
 */
router.delete("/:specId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const cartFeature = new Cart();
    const userId = req.user?.id;
    const specId = req.params.specId;

    if (userId === undefined) {
      return res.status(400).json({
        status: "error",
        data: null,
        error: "查無使用者資訊, 請重新登入",
      });
    }

    if (!specId) {
      return res.status(400).json({
        status: "error",
        data: null,
        error: "缺少必要欄位 specId",
      });
    }

    await cartFeature.refreshCart(userId);
    const deleted = await cartFeature.cartUpdate(userId, specId, 0);
    const result = await formatCart(userId);

    res.json({
      status: "success",
      data: result,
      error: null,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      data: null,
      error: err.message,
    });
  }
});

export async function formatCart(userId: string) {
  const cartFeature = new Cart();
  const photoFeature = new Photo();
  const productFeature = new Product();
  const objUserId = new mongoose.Types.ObjectId(userId);

  const data = await cartFeature.carts({ userId });

  if (!data) {
    const result: CartTableResult = {
      userId: objUserId,
      items: [],
    };
  }

  const specIds = data.items.map((item) => item.specId._id.toString());
  const productIds = data.items.map((item) =>
    item.specId.productUuid.toString(),
  );
  const photos = await photoFeature.list({ specUuid: specIds });
  const product = await productFeature.list({ _id: productIds });

  const items: CartItem[] = data.items.map((item) => {
    const foundPhoto = photos.find(
      (p) => p.specUuid.toString() == item.specId._id.toString(),
    );
    const foundProduct = product.find(
      (pd) => pd._id.toString() == item.specId.productUuid.toString(),
    );

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
      photo: foundPhoto ? (foundPhoto as PhotosProps) : null,
      categoryName: foundProduct?.categoryName.toString(),
      categoryUuid: foundProduct?.categoryUuid.toString(),
    };
  });
  const result: CartTableResult = {
    userId: objUserId,
    items,
  };

  return result;
}

export { router as CartRouter };
