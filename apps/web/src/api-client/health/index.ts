import { GetEnvConfig } from "@/src";
import { ApiHealth } from "./health";

export async function getHealthApi() {
  "use server";
  const config = await GetEnvConfig();
  return new ApiHealth(config.API_URL);
}
