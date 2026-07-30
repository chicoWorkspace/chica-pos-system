import {
  AnnouncementAddParams,
  AnnouncementGetParams,
  AnnouncementResult,
  AnnouncementUpdateParams,
} from "@repo/api-client";
import Api from "../api";

export class ApiAnnouncement extends Api {
  public get(token: string, params: AnnouncementGetParams) {
    const query = new URLSearchParams(params as any).toString();
    const uri = query ? `/announcement?${query}` : "/announcement";

    const result = this.callWithoutToken<AnnouncementResult>({
      method: "GET",
      uri,
    });

    return result;
  }

  public create(token: string, props: AnnouncementAddParams) {
    const result = this.callWithoutToken<AnnouncementResult>({
      method: "POST",
      uri: "/announcement",
      props,
    });

    return result;
  }

}
