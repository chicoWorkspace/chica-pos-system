import { GetEnvConfig } from "@/src";
import { ApiAuth } from "./auth";

export async function getAuthApi() {
  "use server";
  const config = await GetEnvConfig();
  return new ApiAuth(config.API_URL);
}
