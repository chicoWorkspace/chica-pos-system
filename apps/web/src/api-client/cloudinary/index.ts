import { GetEnvConfig } from "@/src";
import { ApiCloudinary} from "./cloudinary";

export async function getCloudinaryApi() {
  "use server";
  const config = await GetEnvConfig();
  return new ApiCloudinary(config.API_URL);
}
