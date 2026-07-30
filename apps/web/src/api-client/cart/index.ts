import { GetEnvConfig } from "@/src";
import { ApiCart } from "./cart";

export async function getCartApi() {
  "use server";
  const config = await GetEnvConfig();
  return new ApiCart(config.API_URL);
}
