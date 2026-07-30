// packages/queue/src/index.ts
import { Queue, QueueOptions } from "bullmq";
import { createRedisInstance } from "@repo/redis";
import { ProcessOrderPayload } from "@repo/api-client";

export enum QueueRegistry {
  ORDER = "orderQueue",
}

function createQueueInstance<T>(
  queueName: QueueRegistry,
  customOptions?: QueueOptions,
) {
  const redisConnection = createRedisInstance(`BullMQ-Instance-${queueName}`);

  return new Queue<T>(queueName, {
    connection: redisConnection as any,
    ...customOptions,
  });
}

export const orderQueue = createQueueInstance<ProcessOrderPayload>(
  QueueRegistry.ORDER,
);
