"use server";

import { auth } from "@/lib/auth";
import { getOrderApi } from "@/src/api-client/order";
import {
  GetOrderRequest,
  OrdersResult,
} from "@repo/api-client";

/**
 * OrderActions Interface
 * 定義所有可用的商品操作方法
 */
export interface IOrderAction {
  get: (params: GetOrderRequest) => Promise<OrdersResult | undefined>;
}

/**
 * 用於商品管理的伺服端動作集合
 * 可於 component 或 server action 中引入使用
 */

export async function get(params: GetOrderRequest) {
  const { api, accessToken } = await setup();
  return await api.get(accessToken, params);
}

export async function setup() {
  const session = await auth();
  const api = await getOrderApi();
  const accessToken = session?.accessToken ?? "";
  return { api, accessToken };
}
