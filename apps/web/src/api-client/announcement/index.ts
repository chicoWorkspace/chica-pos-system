import { GetEnvConfig } from "@/src";
import { ApiAnnouncement } from "./announcement";

export async function getAnnouncementApi() {
  "use server";
  const config = await GetEnvConfig();
  return new ApiAnnouncement(config.API_URL);
}
