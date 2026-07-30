import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

import { authMiddleware } from "../../auth/authMiddleware2";
import { OrderService } from "./order.service";
import { orderQuerySchema, OrderQuery } from "./order.schema";
import { GetOrderRequest } from "@repo/api-client";

export const orderRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const service = new OrderService();

  fastify.get<{ Querystring: GetOrderRequest }>(
    "/",
    {
      schema: {
        tags: ["Order"],
        summary: "訂單列表",
        description:
          "取得所有訂單，支援依 orderId / customerName / status / createdAt 過濾。",
        querystring: orderQuerySchema,
      },
      preHandler: [authMiddleware], // 驗證中介層
    },
    async (request, reply) => {
      const { orderId, userId, status, createdAtFrom, createdAtTo } =
        request.query;

      // 調用服務層的搜尋邏輯
      const results = await service.list({
        orderId,
        userId,
        status,
        createdAtFrom,
        createdAtTo,
      });

      return reply.send({ status: "success", data: results });
    },
  );

  fastify.post<{ Body: { orderId: string; status: "paid" | "cancelled"; token: string } }>(
    "/payment-status",
    {
      schema: {
        tags: ["Order"],
        summary: "更新訂單付款狀態",
        body: Type.Object({
          orderId: Type.String(),
          status: Type.Union([Type.Literal("paid"), Type.Literal("cancelled")]),
          token: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { orderId, status, token } = request.body;

      try {
        const result = await service.updatePaymentStatus(orderId, status, { token });

        return reply.send({ status: "success", data: result });
      } catch (error) {
        return reply.code(400).send({
          status: "error",
          message: error instanceof Error ? error.message : "更新付款狀態失敗",
        });
      }
    },
  );
};
