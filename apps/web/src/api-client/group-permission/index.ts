import { GetEnvConfig } from "@/src";
import { ApiGroupPermission } from "./group-permission";

export async function getGroupPermissionApi() {
  "use server";
  const config = await GetEnvConfig();
  return new ApiGroupPermission(config.API_URL);
}
