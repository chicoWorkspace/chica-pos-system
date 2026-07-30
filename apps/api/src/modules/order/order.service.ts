import { LinePayClient } from "@repo/api-client";
import { Order, OrderGetParams } from "@repo/db";
import { OrderQuery } from "./order.schema";

type PaymentCallbackStatus = "paid" | "cancelled";

export class OrderService {
  private orderFeature = new Order();

  async list(filters: OrderQuery) {
    const { orderId, userId, status, createdAtFrom, createdAtTo } = filters;

    // 構建查詢條件
    const query: Partial<Record<keyof OrderGetParams, any>> = {};
    if (orderId) query._id = orderId;
    if (userId)
      (query as any)["staff.customerName"] = { $regex: userId, $options: "i" };
    if (status) query.status = status;
    if (createdAtFrom || createdAtTo) {
      query.createdAt = {};
      if (createdAtFrom) query.createdAt.$gte = new Date(createdAtFrom);
      if (createdAtTo) query.createdAt.$lte = new Date(createdAtTo);
    }

    return this.orderFeature.getData(query);
  }

  async updatePaymentStatus(
    orderId: string,
    status: PaymentCallbackStatus,
    options?: { token?: string },
  ) {
    if (options?.token !== undefined) {
      const verifiedPayload = LinePayClient.verifyPaymentCallbackToken(
        options.token,
      );

      if (
        !verifiedPayload ||
        verifiedPayload.orderId !== orderId ||
        verifiedPayload.status !== status
      ) {
        throw new Error("無效的付款回調授權");
      }
    }

    const updatePayload: Record<string, any> = {
      status,
    };

    if (status === "paid") {
      updatePayload["payment.paidAt"] = new Date();
    }

    return this.orderFeature.update({ orderNumber: orderId }, updatePayload);
  }
}
