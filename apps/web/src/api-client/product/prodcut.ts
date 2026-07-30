import {
  CreateProductRequest,
  ProductAddParams,
  ProductGetParams,
  ProductResult,
  ProudctInListResult,
  UpdateProductRequest,
  // ProductUpdateParams,
} from "@repo/api-client";
import Api from "../api";
import { SpecInventoryResult } from "@repo/api-client";

export class ApiProduct extends Api {
  public get(token: string, params: ProductGetParams) {
    const query = new URLSearchParams(params as any).toString();
    const uri = query ? `/product?${query}` : "/product";

    const result = this.call<ProudctInListResult[]>({
      method: "GET",
      uri,
      token,
    });

    return result;
  }

  public create(token: string, props: CreateProductRequest) {
    const result = this.call<ProudctInListResult>({
      method: "POST",
      uri: "/product",
      token,
      props,
    });

    return result;
  }

  public update(token: string, id: string, props: UpdateProductRequest) {
    const result = this.call<ProudctInListResult>({
      method: "PATCH",
      uri: `/product/${id}`,
      token,
      props,
    });

    return result;
  }

  public delete(token: string, id: string) {
    const result = this.call<ProductResult>({
      method: "DELETE",
      uri: `/product/${id}`,
      token,
      props: {},
    });

    return result;
  }

  public deleteSpec(token: string, productId: string, specId: string) {
    const result = this.call<SpecInventoryResult>({
      method: "DELETE",
      uri: `/product/${productId}/spec/${specId}`,
      token,
      props: {},
    });

    return result;
  }
}
