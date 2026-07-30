import {
  CategoryAddParams,
  CategoryGetParams,
  CategoryResult,
  CategoryUpdateParams,
} from "@repo/api-client";
import Api from "../api";

export class ApiCategory extends Api {
  public get(token: string, params: CategoryGetParams) {
    const query = new URLSearchParams(params as any).toString();
    const uri = query ? `/category?${query}` : "/category";

    const result = this.call<CategoryResult>({
      method: "GET",
      uri,
      token,
    });

    return result;
  }

  public create(token: string, props: CategoryAddParams) {
    const result = this.call<CategoryResult>({
      method: "POST",
      uri: "/category",
      token,
      props,
    });

    return result;
  }

  public update(token: string, id: string, props: CategoryUpdateParams) {
    const result = this.call<CategoryResult>({
      method: "PATCH",
      uri: `/category/${id}`,
      token,
      props,
    });

    return result;
  }

  public delete(token: string, id: string) {
    const result = this.call<CategoryResult>({
      method: "DELETE",
      uri: `/category/${id}`,
      token,
      props: {},
    });

    return result;
  }
}
