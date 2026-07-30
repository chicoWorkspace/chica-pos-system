import "./load-env";
import { connectToDatabase } from "@repo/db";
import { startWorker } from "./workers/orderWorker";
import mongoose from "mongoose";
import { Worker } from "bullmq";

import { showJobs } from "./queues/orderQueue";

let workerInstance: Worker | null = null;

(async () => {
  await connectToDatabase();
  workerInstance = await startWorker();
})()
  .finally(() => {
    showJobs();
  })
  .catch(console.error);

// 優雅關閉
const shutdown = async (signal: string) => {
  console.log(`\n${signal} 訊號收到，Worker 關閉中...`);
  try {
    if (workerInstance) {
      await workerInstance.close();
      console.log("BullMQ Worker 已安全關閉");
    }
    await mongoose.connection.close();
    console.log("資料庫連線已安全關閉");
    process.exit(0);
  } catch (err) {
    console.error("優雅關閉期間發生錯誤:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
