"use server";

import { auth } from "@/lib/auth";
import { getProductApi } from "@/src/api-client/product";
import {
  CreateProductRequest,
  ProductGetParams,
  ProductResult,
  ProudctInListResult,
  UpdateProductRequest,
} from "@repo/api-client";
import { SpecInventoryResult } from "@repo/api-client";

/**
 * ProductActions Interface
 * 定義所有可用的商品操作方法
 */
export interface IProductAction {
  create: (
    params: CreateProductRequest
  ) => Promise<ProudctInListResult | undefined>;
  get: (params: ProductGetParams) => Promise<ProudctInListResult[] | undefined>;
  update: (
    id: string,
    params: UpdateProductRequest
  ) => Promise<ProudctInListResult | undefined>;
  deleteProduct: (id: string) => Promise<ProductResult | undefined>;
  deleteSpec: (
    productId: string,
    specId: string
  ) => Promise<SpecInventoryResult | undefined>;
}

/**
 * 用於商品管理的伺服端動作集合
 * 可於 component 或 server action 中引入使用
 */
  export async function create(params:CreateProductRequest) {
    const { api, accessToken } = await setup();
    return await api.create(accessToken, params);
  }

  export async function get(params:ProductGetParams) {
    const { api, accessToken } = await setup();
    return await api.get(accessToken, params);
  }

  export async function update(id:string, params:UpdateProductRequest) {
    const { api, accessToken } = await setup();
    return await api.update(accessToken, id, params);
  }

  export async function deleteProduct(id:string) {
    const { api, accessToken } = await setup();
    return await api.delete(accessToken, id);
  }

  export async function deleteSpec(productId:string, specId:string) {
    const { api, accessToken } = await setup();
    return await api.deleteSpec(accessToken, productId, specId);
  }

export async function setup() {
  const session = await auth();
  const api = await getProductApi();
  const accessToken = session?.accessToken ?? "";
  return { api, accessToken };
}
