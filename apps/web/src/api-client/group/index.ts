import { GetEnvConfig } from "@/src";
import { ApiGroup } from "./group";

export async function getGroupApi() {
  "use server";
  const config = await GetEnvConfig();
  return new ApiGroup(config.API_URL);
}
