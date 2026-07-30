import { orderQueue } from "@repo/queue";

export async function showJobs() {
  const waiting = await orderQueue.getWaiting();
  const active = await orderQueue.getActive();
  const completed = await orderQueue.getCompleted();
  const failed = await orderQueue.getFailed();

  console.log("⏳ 等待中:", waiting.length);
  console.log("🚀 執行中:", active.length);
  console.log("✅ 完成:", completed.length);
  console.log("❌ 失敗:", failed.length);
}
