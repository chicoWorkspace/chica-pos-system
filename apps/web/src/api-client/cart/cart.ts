import {
  CartOrderParams,
  CartTableResult,
  CartUpdateParams
} from "@repo/api-client";
import Api from "../api";

export class ApiCart extends Api {
  public order(token: string, props: CartOrderParams) {
    const result = this.call<null>({
      method: "POST",
      uri: "/cart/order",
      token,
      props,
    });

    return result;
  }

  public get(token: string) {
    const result = this.call<CartTableResult>({
      method: "GET",
      uri: "/cart",
      token,
    });

    return result;
  }

  public update(token: string, specId: string, props: CartUpdateParams) {
    const result = this.call<CartTableResult>({
      method: "PATCH",
      uri: `/cart/${specId}`,
      token,
      props,
    });

    return result;
  }

  public delete(token: string, specId: string) {
    const result = this.call<CartTableResult>({
      method: "DELETE",
      uri: `/cart/${specId}`,
      token,
      props: {},
    });

    return result;
  }

  public clear(token: string) {
    const result = this.call<CartTableResult>({
      method: "DELETE",
      uri: `/cart`,
      token,
      props: {},
    });
    return result;
  }
}
