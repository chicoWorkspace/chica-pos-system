import { RedisSocketEvent } from "@repo/api-client";
import { RedisClientType } from "redis";

export type RedisEvent = {
  type: string;
  payload: any;
};

// 訂閱 Redis 事件
export function subscribeSocketEvents(
  sub: RedisClientType,
  onEvent: (event: RedisSocketEvent) => void
) {
  return sub.subscribe("socket:events", (message) => {
    try {
      const event = JSON.parse(message);
      onEvent(event);
    } catch (err) {
      console.error("Invalid socket event:", message);
    }
  });
}