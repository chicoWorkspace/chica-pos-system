"use server";

import { auth } from "@/lib/auth";
import { getCartApi } from "@/src/api-client/cart";
import {
  CartOrderParams,
  CartResult,
  CartTableResult,
  CartUpdateParams,
} from "@repo/api-client";

export interface ICartAction {
  get(): Promise<CartTableResult | undefined>;
  order(params: CartOrderParams): Promise<null | undefined>;
  update(
    specId: string,
    params: CartUpdateParams,
  ): Promise<CartTableResult | undefined>;
  deleteSpec(specId: string): Promise<CartTableResult | undefined>;
  clear(): Promise<CartTableResult | undefined>;
}

/**
 * 用於 Cart 的伺服端動作集合
 * 可於任何元件中傳入或使用
 * 例如：const { getCartList } = CartActions;
 */
export async function get() {
  const { api, accessToken } = await setup();
  return await api.get(accessToken);
}
export async function order(params: CartOrderParams) {
  const { api, accessToken } = await setup();
  return await api.order(accessToken, params);
}
export async function update(specId: string, params: CartUpdateParams) {
  const { api, accessToken } = await setup();
  return await api.update(accessToken, specId, params);
}

export async function deleteSpec(specId: string) {
  const { api, accessToken } = await setup();
  return await api.delete(accessToken, specId);
}

export async function clear() {
  const { api, accessToken } = await setup();
  return await api.clear(accessToken);
}

export async function setup() {
  const session = await auth();
  const api = await getCartApi();
  const accessToken = session?.accessToken ?? "";
  return { api, accessToken };
}
