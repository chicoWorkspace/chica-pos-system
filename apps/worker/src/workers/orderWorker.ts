import {
  LinePayClient,
  Package,
  ProcessOrderPayload,
  Product,
  RedisOrderCompletedEvent,
  RedisOrderFailedEvent,
  RedisOrderLinepayURLEvent,
} from "@repo/api-client";
import { Admin, Cart, Order } from "@repo/db";
import { createRedisInstance } from "@repo/redis";
import { Job, Worker } from "bullmq";
import { showJobs } from "../queues/orderQueue";
import { generateReadableOrderNumber } from "../utils/gen-order";

export async function startWorker() {
  // 1️⃣ 建立 Redis Publisher (改用 ioredis 確保環境變數處理與專案其他地方一致)
  const pubClient = createRedisInstance("BullMQ-Publisher");

  const workerRedisConnection = createRedisInstance("BullMQ-OrderWorker");

  const orderWorker = new Worker(
    "orderQueue",
    async (job: Job) => {
      const { userId, paymentMethod, items, tipRate }: ProcessOrderPayload =
        job.data;
      if (!userId || !items?.length) {
        throw new Error("job data 缺少 userId 或 items");
      }

      const featureOrder = new Order();
      const featureAdmin = new Admin();
      const featureCart = new Cart();
      try {
        const admin = await featureAdmin.getAdminByUserId(userId);
        if (!admin) {
          throw new Error("找不到對應的管理員資料");
        }

        const orderNumber = await generateReadableOrderNumber();
        const order = await featureOrder.createOrder({
          orderNumber,
          userId,
          paymentMethod,
          items,
          tipRate,
        });

        let result: RedisOrderLinepayURLEvent | RedisOrderCompletedEvent;

        switch (paymentMethod) {
          case "linepay":
            const products = order.data.items;
            const pakagesProducts: Product[] = products.map((item) => {
              return {
                id: item.specId.toString(),
                name: item.snapshot.name,
                imageUrl: item.snapshot.photo?.filename || "",
                quantity: item.quantity,
                price: item.snapshot.price,
              };
            });

            if (tipRate > 0) {
              const tipAmount = Math.round(order.data.totalAmount * tipRate);
              pakagesProducts.push({
                id: "tip",
                name: "小費",
                imageUrl: "",
                quantity: 1,
                price: tipAmount,
              });
            }
            const finalAmount = order.data.finalAmount;

            const pakages: Package = {
              id: order.data._id.toString(),
              amount: finalAmount,
              products: pakagesProducts,
            };

            const baseUrl =
              process.env.FRONTEND_DOMAIN || "http://localhost:3000";
            const successToken = LinePayClient.createPaymentCallbackToken({
              orderId: order.data.orderNumber.toString(),
              status: "paid",
              exp: Math.floor(Date.now() / 1000) + 300,
            });
            const failureToken = LinePayClient.createPaymentCallbackToken({
              orderId: order.data.orderNumber.toString(),
              status: "cancelled",
              exp: Math.floor(Date.now() / 1000) + 300,
            });
            const data = {
              amount: finalAmount,
              currency: "TWD",
              orderId: order.data._id.toString(),
              packages: [pakages],
              redirectUrls: {
                confirmUrl: `${baseUrl}/payment/linepay/success?orderId=${order.data.orderNumber.toString()}&token=${encodeURIComponent(successToken)}`,
                cancelUrl: `${baseUrl}/payment/linepay/failure?orderId=${order.data.orderNumber.toString()}&token=${encodeURIComponent(failureToken)}`,
              },
            };

            const linepayResult = await LinePayClient.requestPayment(data);

            if (!linepayResult || linepayResult.returnCode !== "0000") {
              throw new Error(
                "LINE Pay 付款請求失敗: " +
                  (linepayResult?.returnMessage || "未知錯誤"),
              );
            }

            result = {
              userId,
              type: "order:linepay_url",
              payload: {
                web: linepayResult.info.paymentUrl.web,
                app: linepayResult.info.paymentUrl.app,
              },
            };

            break;
          default:
            result = {
              userId,
              type: "order:completed",
              payload: {
                _id: order.data._id,
                orderNumber,
                items: order.data.items,
                totalAmount: order.data.totalAmount,
                discountAmount: order.data.discountAmount,
                finalAmount: order.data.finalAmount,
                status: order.data.status,
                payment: order.data.payment,
                staff: {
                  userId: admin._id,
                  username: admin.username,
                },
                createdAt: order.data.createdAt,
                updatedAt: order.data.updatedAt,
              },
            };
            break;
        }

        // 發送 Socket.IO 通知（透過 Redis Pub/Sub）
        await pubClient.publish("socket:events", JSON.stringify(result));
      } catch (error: any) {
        const result: RedisOrderFailedEvent = {
          userId,
          type: "order:failed",
          payload: {
            code: "ORDER_CREATION_FAILED",
            message: error.message,
            retryable: false,
          },
        };
        await pubClient.publish("socket:events", JSON.stringify(result));
      }
    },
    {
      connection: workerRedisConnection as any,
      removeOnComplete: { count: 100 }, 
      removeOnFail: { count: 500 },   
    },
  );

  orderWorker.on("completed", async (job) => {
    console.log(`Job ${job.id} 已完成`);
    showJobs();
  });

  orderWorker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} 失敗:`, err);
  });

  return orderWorker;
}

