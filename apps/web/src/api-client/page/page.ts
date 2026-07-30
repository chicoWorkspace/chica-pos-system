import {
  PageCreateParams,
  PageResult,
  PagesGetParams,
  PagesResult,
} from "@repo/api-client";
import Api from "../api";

export class ApiPage extends Api {
  public getPages(token: string, params: PagesGetParams) {
    const query = new URLSearchParams(params as any).toString();
    const uri = query ? `/page?${query}` : "/page";

    const result = this.call<PagesResult>({
      method: "GET",
      uri,
      token,
    });

    return result;

    return result;
  }

  public create(token: string, props: PageCreateParams) {
    const result = this.call<PageResult>({
      method: "POST",
      uri: "/page",
      token,
      props,
    });

    return result;
  }
}
