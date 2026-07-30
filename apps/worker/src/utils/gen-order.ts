import { createRedisInstance } from "@repo/redis";

export async function generateReadableOrderNumber(): Promise<string> {
  const now = new Date();
  const workerRedisConnection = createRedisInstance("BullMQ-OrderQueue");

  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");

  const redisKey = `order_seq:${datePart}`;

  const sequence = await workerRedisConnection.incr(redisKey);

  if (sequence === 1) {
    await workerRedisConnection.expire(redisKey, 86400); //24小時後自動刪除
  }

  const seqPart = sequence.toString().padStart(5, "0");

  // ex：2026042600001
  return `OR${datePart}${seqPart}`;
}
