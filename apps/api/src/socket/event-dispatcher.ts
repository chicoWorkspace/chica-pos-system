import { Server } from "socket.io";
import { rooms } from "./rooms";
import { ServerToClientEvents } from "@repo/api-client";
import {
  RedisOrderCompletedEvent,
  RedisSocketEvent,
} from "@repo/api-client";
import { OrderEvent } from "@repo/api-client";
import { ca } from "zod/v4/locales/index.cjs";
import { AnnouncementService } from "../modules/announcement/announcement.service";
import { OrderCreaterResult } from "@repo/api-client";
import { createOrderAnnouncement } from "../modules/announcement/announcement.effect";
import { ProductService } from "@/modules/product/product.service";

type IOServer = Server<any, ServerToClientEvents>;
// 根據 Redis 發佈的事件，分派到對應的 Socket.IO 頻道
export async function dispatchSocketEvent(
  io: IOServer,
  event: RedisSocketEvent,
) {
  const productService = new ProductService();

  const socketEvent = mapRedisToOrderEvent(event);

  switch (event.type) {
    case "order:completed":
      await productService.invalidateCache();
      io.to(rooms.user(event.userId)).emit("order:state", socketEvent);

      try {
        //建立公告廣播到前端
        const eventT: RedisOrderCompletedEvent = event;
        const order = eventT.payload;
        const newAnnouncement = await createOrderAnnouncement(order);
        io.emit("announcement:publish", [newAnnouncement.data]);
      } catch (error) {
      }
      break;
    case "order:linepay_url":
    case "order:failed":
      io.to(rooms.user(event.userId)).emit("order:state", socketEvent);

      break;
    default:
  }
}

// 將 Redis 事件映射到 Socket.IO 事件格式 (可揪出格式錯誤)
export function mapRedisToOrderEvent(event: RedisSocketEvent): OrderEvent {
  switch (event.type) {
    case "order:completed":
      return {
        type: "success",
        payload: event.payload,
        timestamp: Date.now(),
      };
    case "order:linepay_url":
      return {
        type: "linepay_url",
        payload: event.payload,
        timestamp: Date.now(),
      };
    case "order:failed":
      return {
        type: "failed",
        payload: event.payload,
        timestamp: Date.now(),
      };

    // default:
    // return assertNever(event);
  }
}
