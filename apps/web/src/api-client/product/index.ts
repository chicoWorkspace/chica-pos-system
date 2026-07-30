import { GetEnvConfig } from "@/src";
import { ApiProduct} from "./prodcut";

export async function getProductApi() {
  "use server";
  const config = await GetEnvConfig();
  return new ApiProduct(config.API_URL);
}
