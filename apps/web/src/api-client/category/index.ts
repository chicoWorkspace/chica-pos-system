import { GetEnvConfig } from "@/src";
import { ApiCategory } from "./category";

export async function getCategoryApi() {
  "use server";
  const config = await GetEnvConfig();
  return new ApiCategory(config.API_URL);
}
