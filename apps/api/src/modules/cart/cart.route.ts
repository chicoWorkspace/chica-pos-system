import { FastifyPluginAsync } from "fastify";
import { CartService } from "./cart.service";
import {
  orderSchema,
  updateCartSchema,
  specIdParamSchema,
} from "./cart.schema";
import { redis } from "@repo/redis";
import { orderQueue } from "@repo/queue";
// @ts-ignore
import { authMiddleware } from "../../auth/authMiddleware2";
import { paymentMethods } from "@repo/db";
import { GetEnvConfig } from "@/utils";
import { CartTableResult } from "@repo/api-client";
const config = GetEnvConfig();

const cartService = new CartService();

export const cartRoutes: FastifyPluginAsync = async (fastify) => {
  // 下訂單
  fastify.post(
    "/order",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Cart"],
        summary: "下訂單",
        description:
          "將使用者購物車的商品建立訂單。下訂單前會鎖定使用者，防止重複送出。",
        body: orderSchema,
      },
    },
    async (req, reply) => {
      const userId = (req as any).user?.id;
      const { paymentMethod } = req.body as { paymentMethod: paymentMethods };

      const lockKey = `order:lock:${userId}`;
      const existing = await redis.get(lockKey);
      if (existing) {
        return reply
          .status(400)
          .send({ status: "error", error: "訂單正在處理中，請稍後再試" });
      }

      await cartService.reFreshCart(userId);
      const cart = await cartService.getCartData(userId);
      if (!cart.items.length) {
        return reply
          .status(400)
          .send({ status: "error", error: "購物車為空，請先將商品加入購物車" });
      }

      await redis.set(lockKey, "locked", "EX", 5);

      await orderQueue.add("processOrder", {
        userId,
        paymentMethod,
        items: cart.items,
        tipRate: config.TIP_RATE,
      });
      fastify.io
        .to(`user_${userId}`)
        .emit("system:announcement", "您的訂單已成功送出，正在處理中！");

      reply.send({ status: "success", data: null });
    },
  );

  // 取得購物車
  fastify.get(
    "/",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Cart"],
        summary: "取得使用者購物車",
        description:
          "取得當前使用者購物車的商品列表與數量。用於 POS 或前台購物車頁面。",
      },
    },
    async (req, reply) => {
      const userId = (req as any).user?.id;
      if (!userId)
        return reply
          .status(400)
          .send({ status: "error", error: "查無使用者資訊, 請重新登入" });

      await cartService.reFreshCart(userId);
      const result = await cartService.getCart(userId);

      reply.send({ status: "success", data: result });
    },
  );

  // 更新購物車商品數量
  fastify.patch(
    "/:specId",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Cart"],
        summary: "更新購物車商品數量",
        description:
          "修改指定商品規格在購物車中的數量。數量為 0 等同於刪除該商品。",
        body: updateCartSchema,
        params: specIdParamSchema,
      },
    },
    async (req, reply) => {
      const userId = (req as any).user?.id;
      const { specId } = req.params as { specId: string };
      const { quantity } = req.body as { quantity: number };

      if (!userId)
        return reply
          .status(400)
          .send({ status: "error", error: "查無使用者資訊, 請重新登入" });
      fastify.log.info("PATCH /cart/:specId" + { userId, specId, quantity });

      await cartService.reFreshCart(userId);

      await cartService.cartUpdate(userId, specId, quantity);
      await cartService.invalidateCartCache(userId);

      const result = await cartService.getCart(userId);

      reply.send({ status: "success", data: result });
    },
  );

  // 移除購物車商品
  fastify.delete(
    "/:specId",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Cart"],
        summary: "移除購物車商品",
        description: "將購物車中指定商品規格移除。",
        params: specIdParamSchema,
      },
    },
    async (req, reply) => {
      const userId = (req as any).user?.id;
      const { specId } = req.params as { specId: string };
      if (!userId)
        return reply
          .status(400)
          .send({ status: "error", error: "查無使用者資訊, 請重新登入" });

      await cartService.reFreshCart(userId);
      await cartService.cartUpdate(userId, specId, 0);
      await cartService.invalidateCartCache(userId);

      const result = await cartService.getCart(userId);
      reply.send({ status: "success", data: result });
    },
  );

  // 清空購物車
  fastify.delete(
    "/",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Cart"],
        summary: "清空購物車商品",
        description: "將購物車商品全部移除。",
      },
    },
    async (req, reply) => {
      const userId = (req as any).user?.id;
      if (!userId)
        return reply
          .status(400)
          .send({ status: "error", error: "查無使用者資訊, 請重新登入" });

      await cartService.reFreshCart(userId);
      await cartService.cartClear(userId);
      await cartService.invalidateCartCache(userId);

      reply.send({
        status: "success",
        data: { userId: userId, items: [] } as CartTableResult,
      });
    },
  );
};
