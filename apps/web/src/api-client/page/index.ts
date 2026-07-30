import { GetEnvConfig } from "@/src";
import { ApiPage } from "./page"; 

export async function getPageApi() {
  "use server";
  const config = await GetEnvConfig();
  return new ApiPage(config.API_URL);
}
