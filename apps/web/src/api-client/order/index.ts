import { GetEnvConfig } from "@/src";
import { ApiOrder } from "./order";

export async function getOrderApi() {
  "use server";
  const config = await GetEnvConfig();
  return new ApiOrder(config.API_URL);
}
