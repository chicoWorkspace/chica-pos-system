import {
  GetOrderRequest,
  OrdersResult,
} from "@repo/api-client";
import Api from "../api";

export class ApiOrder extends Api {
  public get(token: string, params: GetOrderRequest) {
    const query = new URLSearchParams(params as any).toString();
    const uri = query ? `/order?${query}` : "/order";

    const result = this.call<OrdersResult>({
      method: "GET",
      uri,
      token,
    });
    return result;
  }
}
